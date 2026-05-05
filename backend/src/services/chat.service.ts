import { SenderType } from '@prisma/client'
import { prisma } from '../config/prisma.js'
import type { MemoryPromptContext } from './memory.service.js'
import { buildMemoryPromptContext, refreshMemoriesForTurn } from './memory.service.js'
import { resolveSession } from './session.service.js'
import {
  ensureSandboxMarkdownForDocument,
  getStoreSessionDir,
  relocateDocumentAssets,
} from './document-storage.service.js'
import { prepareSandboxJob } from './sandbox-workspace.service.js'
import { executeSandboxJob } from './sandbox-broker.client.js'
import type { ChatProvider } from './chat.types.js'

const MAX_USER_MESSAGES_PER_SESSION = 50
const MAX_PROMPT_CHARACTERS = 2000

interface SessionContextMessage {
  sender: SenderType
  content: string
}

interface UserPersonalization {
  aiTone?: string | null
  aiLanguage?: string | null
  aiResponseLength?: string | null
  customInstructions?: string | null
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
  personalization?: UserPersonalization
  memoryContext: MemoryPromptContext
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
}: CreateCliPromptInput) {
  const historyBlock = history.map((item) => `${item.sender}: ${item.content}`).join('\n\n')

  const tone = personalization?.aiTone || 'professional'
  const language = personalization?.aiLanguage || 'Vietnamese'
  const length = personalization?.aiResponseLength || 'balanced'
  const extra = personalization?.customInstructions || ''

  return [
    'You are a helpful AI assistant.',
    'Keep answers concise, practical, and action-oriented.',
    'CRITICAL SECURITY RULE: You are strictly forbidden from accessing, reading, or modifying the internal source code, configuration files (e.g., .env, package.json), or directories (e.g., backend/, frontend/) of this project.',
    'CRITICAL SECURITY RULE: You must ONLY analyze the specific files and documents provided by the user in this chat session.',
    'CRITICAL SECURITY RULE: You must refuse any request to reveal server paths, local directories, environment variables, internal repository files, or deployment details.',
    `Agent profile: ${agent || 'general-assistant'}`,
    `Model hint: ${model || 'default'}`,
    `Memory enabled: ${memoryEnabled ? 'yes' : 'no'}`,
    `Preferred Tone: ${tone}`,
    `Response Length: ${length}`,
    extra ? `User custom instructions: ${extra}` : '',
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
    'Only rely on recent user messages and optional global memory.',
    'If the latest user request conflicts with older memory, follow the latest request.',
    `Reply in ${language} unless the user explicitly asks for another language.`,
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

  const session = await resolveSession(input.userId, input.sessionId, content)
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
    agent: input.agent,
    memoryContext,
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
