import fs from 'node:fs'
import path from 'node:path'
import { SenderType } from '@prisma/client'
import { env } from '../config/env.js'
import { prisma } from '../config/prisma.js'
import { resolveSession } from './session.service.js'
import { cleanupSandboxJob, prepareSandboxJob } from './sandbox-workspace.service.js'
import { executeSandboxJob } from './sandbox-broker.client.js'
import type { ChatProvider, MemoryMode } from './chat.types.js'

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
  memoryMode?: MemoryMode
  agent?: string
  attachmentIds?: string[]
}

interface CreateCliPromptInput {
  history: SessionContextMessage[]
  content: string
  model?: string
  memoryMode?: MemoryMode
  agent?: string
  personalization?: UserPersonalization
}

interface ResolvedAttachment {
  id: string
  originalName: string
  filePath: string
  mimeType: string
  size: number
}

function createCliPrompt({
  history,
  content,
  model,
  memoryMode,
  agent,
  personalization,
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
    `Memory mode: ${memoryMode || 'session'}`,
    `Preferred Tone: ${tone}`,
    `Response Length: ${length}`,
    extra ? `User custom instructions: ${extra}` : '',
    '',
    'Conversation history:',
    historyBlock || '(no previous messages)',
    '',
    'Latest user message:',
    content,
    '',
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

  const sessionDir = path.join(env.userDocsRoot, userId, sessionId)
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true })
  }

  const resolvedAttachments: ResolvedAttachment[] = []

  for (const doc of docs) {
    const currentPath = doc.filePath
    const fileName = path.basename(currentPath)
    const newPath = path.join(sessionDir, fileName)

    if (currentPath !== newPath && fs.existsSync(currentPath)) {
      try {
        const sourceDir = path.dirname(currentPath)
        fs.renameSync(currentPath, newPath)

        await prisma.document.update({
          where: { id: doc.id },
          data: {
            sessionId,
            filePath: newPath,
          },
        })

        if (path.basename(sourceDir) === 'general' && fs.readdirSync(sourceDir).length === 0) {
          fs.rmdirSync(sourceDir)
        }

        resolvedAttachments.push({
          id: doc.id,
          originalName: doc.originalName,
          filePath: newPath,
          mimeType: doc.mimeType,
          size: doc.size,
        })
      } catch (renameError) {
        console.error(`[chat.service] Failed to move file from ${currentPath} to ${newPath}`, renameError)
        resolvedAttachments.push({
          id: doc.id,
          originalName: doc.originalName,
          filePath: currentPath,
          mimeType: doc.mimeType,
          size: doc.size,
        })
      }
    } else {
      if (doc.sessionId !== sessionId) {
        await prisma.document.update({
          where: { id: doc.id },
          data: { sessionId },
        })
      }

      resolvedAttachments.push({
        id: doc.id,
        originalName: doc.originalName,
        filePath: currentPath,
        mimeType: doc.mimeType,
        size: doc.size,
      })
    }
  }

  return resolvedAttachments
}

export async function sendMessage(input: SendMessageInput) {
  const rawContent = input.content.trim()
  const hasAttachments = input.attachmentIds && input.attachmentIds.length > 0
  const content = rawContent || (hasAttachments ? 'đọc và tổng hợp lại' : '')

  if (!content) {
    throw new Error('Message content is required')
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

  const recentMessages = await prisma.message.findMany({
    where: {
      sessionId: session.id,
    },
    take: 20,
    select: {
      sender: true,
      content: true,
    },
  })

  const prompt = createCliPrompt({
    history: recentMessages.reverse(),
    content,
    model: input.model,
    memoryMode: input.memoryMode,
    agent: input.agent,
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
  let sandboxJobId: string | null = null

  try {
    const sandboxJob = await prepareSandboxJob({
      userId: input.userId,
      sessionId: session.id,
      provider: input.provider,
      prompt,
      model: input.model,
      attachments: resolvedAttachments.map((attachment) => ({
        documentId: attachment.id,
        originalName: attachment.originalName,
        filePath: attachment.filePath,
        mimeType: attachment.mimeType,
        size: attachment.size,
      })),
    })

    sandboxJobId = sandboxJob.jobId

    const generated = await executeSandboxJob({
      jobId: sandboxJob.jobId,
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
  } catch (error) {
    assistantMessage = await prisma.message.create({
      data: {
        sessionId: session.id,
        sender: SenderType.SYSTEM,
        content: `CLI execution failed: ${(error as Error).message}`,
      },
    })
  } finally {
    if (sandboxJobId) {
      try {
        await cleanupSandboxJob(sandboxJobId)
      } catch (cleanupError) {
        console.error(`[chat.service] Failed to cleanup sandbox job ${sandboxJobId}`, cleanupError)
      }
    }
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
