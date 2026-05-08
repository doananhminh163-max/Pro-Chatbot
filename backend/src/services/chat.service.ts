import { SenderType } from '@prisma/client'
import { prisma } from '../config/prisma.js'
import { resolveAgentRuntime } from './admin.service.js'
import type { MemoryPromptContext } from './memory.service.js'
import { buildMemoryPromptContext, refreshMemoriesForTurn } from './memory.service.js'
import { resolveSession } from './session.service.js'
import {
  ensureSandboxMarkdownForDocument,
  getStoreSessionDir,
  relocateDocumentAssets,
} from './document-storage.service.js'
import type { SandboxUserPolicyPreferences } from './sandbox-policy.service.js'
import { prepareSandboxJob } from './sandbox-workspace.service.js'
import { executeSandboxJob } from './sandbox-broker.client.js'
import type { ChatProvider } from './chat.types.js'

const MAX_USER_MESSAGES_PER_SESSION = 50
const MAX_PROMPT_CHARACTERS = 2000

interface SessionContextMessage {
  sender: SenderType
  content: string
}

interface SendMessageInput {
  userId: string
  content: string
  sessionId?: string
  provider: ChatProvider
  model?: string
  memoryEnabled?: boolean
  agent?: string
  attachmentIds?: string[]
}

interface CreateCliPromptInput {
  history: SessionContextMessage[]
  content: string
  model?: string
  memoryEnabled: boolean
  agent?: string
  personalization?: SandboxUserPolicyPreferences
  memoryContext: MemoryPromptContext
  sessionId: string
  agentSystemPrompt?: string | null
}

interface ResolvedAttachment {
  id: string
  originalName: string
  filePath: string
  markdownPath: string
  mimeType: string
  size: number
}

function formatMemorySection(
  entries: MemoryPromptContext['globalMemories'],
) {
  if (entries.length === 0) {
    return '(none)'
  }

  return entries
    .map((entry, index) => `${index + 1}. [${entry.kind}] ${entry.title}: ${entry.content}`)
    .join('\n')
}

function createCliPrompt({
  history,
  content,
  model,
  memoryEnabled,
  agent,
  personalization,
  memoryContext,
  sessionId,
  agentSystemPrompt,
}: CreateCliPromptInput) {
  const historyBlock = history.map((item) => `${item.sender}: ${item.content}`).join('\n\n')

  return [
    'Conversation context for the active request:',
    `Active session: ${sessionId}`,
    `Agent profile: ${agent || 'general-assistant'}`,
    agentSystemPrompt ? `Agent mission: ${agentSystemPrompt}` : '',
    `Model hint: ${model || 'default'}`,
    `Memory enabled: ${memoryEnabled ? 'yes' : 'no'}`,
    '',
    'Global user/work memory:',
    memoryEnabled ? formatMemorySection(memoryContext.globalMemories) : '(disabled for this turn)',
    '',
    'Recent user messages:',
    historyBlock || '(no previous messages)',
    '',
    'Latest user message:',
    content,
    '',
    'Instructions for this request:',
    '- Only rely on the latest user message, recent conversation history, optional global memory, and trusted backend attachment context.',
    '- The allowed document scope is the active session only.',
    'If the latest user request conflicts with older memory, follow the latest request.',
  ].filter((line) => line !== '').join('\n')
}

async function resolveAndRelocateAttachments(userId: string, sessionId: string, attachmentIds: string[]) {
  const docs = await prisma.document.findMany({
    where: {
      id: { in: attachmentIds },
      userId,
    },
  })

  if (docs.length !== attachmentIds.length) {
    throw new Error('One or more attachments were not found')
  }

  const docsById = new Map(docs.map((doc) => [doc.id, doc]))
  const resolvedAttachments: ResolvedAttachment[] = []

  for (const attachmentId of attachmentIds) {
    const doc = docsById.get(attachmentId)

    if (!doc) {
      throw new Error(`Attachment ${attachmentId} was not found`)
    }

    const expectedFilePath = `${getStoreSessionDir(userId, sessionId)}\\${doc.fileName}`
    let filePath = doc.filePath
    let markdownPath = ''

    const shouldRelocate = doc.sessionId !== sessionId || doc.filePath !== expectedFilePath

    if (shouldRelocate) {
      const relocated = await relocateDocumentAssets({
        userId,
        fromSessionId: doc.sessionId,
        toSessionId: sessionId,
        documentId: doc.id,
        originalName: doc.originalName,
        fileName: doc.fileName,
        currentFilePath: doc.filePath,
        mimeType: doc.mimeType,
      })

      filePath = relocated.filePath
      markdownPath = relocated.markdownPath

      await prisma.document.update({
        where: { id: doc.id },
        data: {
          sessionId,
          filePath,
        },
      })
    } else {
      markdownPath = await ensureSandboxMarkdownForDocument({
        userId,
        sessionId,
        documentId: doc.id,
        originalName: doc.originalName,
        filePath: doc.filePath,
        mimeType: doc.mimeType,
      })
    }

    resolvedAttachments.push({
      id: doc.id,
      originalName: doc.originalName,
      filePath,
      markdownPath,
      mimeType: doc.mimeType,
      size: doc.size,
    })
  }

  return resolvedAttachments
}

export async function sendMessage(input: SendMessageInput) {
  const memoryEnabled = input.memoryEnabled ?? true
  const rawContent = input.content.trim()
  const hasAttachments = input.attachmentIds && input.attachmentIds.length > 0
  const content = rawContent || (hasAttachments ? 'Read and summarize the attachments.' : '')

  if (!content) {
    throw new Error('Message content is required')
  }

  if (rawContent.length > MAX_PROMPT_CHARACTERS) {
    throw new Error(
      `Prompt text is limited to ${MAX_PROMPT_CHARACTERS} characters. If you need to send more, upload a file up to 20 MB and keep the message short.`,
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    select: {
      aiTone: true,
      aiLanguage: true,
      aiResponseLength: true,
      customInstructions: true,
    },
  })

  const resolvedAgent = await resolveAgentRuntime(input.agent)

  const session = await resolveSession(input.userId, input.sessionId, content, resolvedAgent?.id || null)
  const existingUserMessageCount = await prisma.message.count({
    where: {
      sessionId: session.id,
      sender: SenderType.USER,
    },
  })

  if (existingUserMessageCount >= MAX_USER_MESSAGES_PER_SESSION) {
    const limitMessage = await prisma.message.create({
      data: {
        sessionId: session.id,
        sender: SenderType.SYSTEM,
        content: `Session limit reached: each session accepts at most ${MAX_USER_MESSAGES_PER_SESSION} user messages. Start a new session to continue.`,
      },
    })

    return {
      session: {
        id: session.id,
        title: session.title,
      },
      userMessage: null,
      assistantMessage: limitMessage,
      meta: {
        usedProvider: null,
        fallbackUsed: false,
        requestedProvider: input.provider,
        requestedModel: input.model || null,
      },
    }
  }

  const resolvedAttachments = hasAttachments && input.attachmentIds
    ? await resolveAndRelocateAttachments(input.userId, session.id, input.attachmentIds)
    : []

  const userMessage = await prisma.message.create({
    data: {
      sessionId: session.id,
      sender: SenderType.USER,
      content,
      documents: hasAttachments && input.attachmentIds
        ? {
            connect: input.attachmentIds.map((id) => ({ id })),
          }
        : undefined,
    },
    include: {
      documents: true,
    },
  })

  const [recentMessages, memoryContext] = await Promise.all([
    prisma.message.findMany({
      where: {
        sessionId: session.id,
        sender: SenderType.USER,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: MAX_USER_MESSAGES_PER_SESSION,
      select: {
        id: true,
        sender: true,
        content: true,
      },
    }),
    buildMemoryPromptContext(input.userId, memoryEnabled),
  ])

  const orderedRecentMessages = recentMessages.reverse()
  const historicalMessages = orderedRecentMessages
    .filter((message) => message.id !== userMessage.id)
    .map(({ sender, content: messageContent }) => ({ sender, content: messageContent }))

  const prompt = createCliPrompt({
    history: historicalMessages,
    content,
    model: input.model,
    memoryEnabled,
    agent: resolvedAgent?.name || input.agent,
    agentSystemPrompt: resolvedAgent?.systemPrompt,
    memoryContext,
    sessionId: session.id,
    personalization: {
      aiTone: user?.aiTone,
      aiLanguage: user?.aiLanguage,
      aiResponseLength: user?.aiResponseLength,
      customInstructions: user?.customInstructions,
    },
  })

  let assistantMessage: {
    id: string
    sessionId: string
    sender: SenderType
    content: string
  } | null = null

  let usedProvider: ChatProvider | null = null
  let fallbackUsed = false

  try {
    await prepareSandboxJob({
      userId: input.userId,
      sessionId: session.id,
      provider: input.provider,
      prompt,
      model: input.model,
      preferences: {
        aiTone: user?.aiTone,
        aiLanguage: user?.aiLanguage,
        aiResponseLength: user?.aiResponseLength,
        customInstructions: user?.customInstructions,
      },
      agentInstructions: resolvedAgent
        ? {
            id: resolvedAgent.id,
            name: resolvedAgent.name,
            description: resolvedAgent.description,
            systemPrompt: resolvedAgent.systemPrompt,
            skills: resolvedAgent.skills.map((skill) => ({
              id: skill.id,
              name: skill.name,
              description: skill.description,
              instructions: skill.instructions,
            })),
            mcps: resolvedAgent.mcps.map((mcp) => ({
              id: mcp.id,
              provider: mcp.provider,
              source: mcp.source,
              name: mcp.name,
              command: mcp.command,
            })),
            geminiMcpSettings: resolvedAgent.geminiMcpSettings,
            opencodeMcpSettings: resolvedAgent.opencodeMcpSettings,
          }
        : undefined,
      attachments: resolvedAttachments.map((attachment) => ({
        documentId: attachment.id,
        originalName: attachment.originalName,
        markdownPath: attachment.markdownPath,
        mimeType: attachment.mimeType,
        size: attachment.size,
      })),
    })

    const generated = await executeSandboxJob({
      userId: input.userId,
      sessionId: session.id,
      provider: input.provider,
      prompt,
      model: input.model,
    })

    usedProvider = generated.usedProvider
    fallbackUsed = generated.fallbackUsed

    assistantMessage = await prisma.message.create({
      data: {
        sessionId: session.id,
        sender: SenderType.AI,
        content: generated.reply,
      },
    })

    await refreshMemoriesForTurn({
      userId: input.userId,
      sessionId: session.id,
      provider: input.provider,
      model: input.model,
      memoryEnabled,
      transcript: orderedRecentMessages.map(({ sender, content: messageContent }) => ({
        sender,
        content: messageContent,
      })),
    })
  } catch (error) {
    assistantMessage = await prisma.message.create({
      data: {
        sessionId: session.id,
        sender: SenderType.SYSTEM,
        content: `CLI execution failed: ${(error as Error).message}`,
      },
    })
  }

  return {
    session: {
      id: session.id,
      title: session.title,
    },
    userMessage,
    assistantMessage,
    meta: {
      usedProvider,
      fallbackUsed,
      requestedProvider: input.provider,
      requestedModel: input.model || null,
    },
  }
}
