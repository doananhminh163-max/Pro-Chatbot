import type { Request, Response } from 'express'
import { z } from 'zod'
import {
  sendMessage,
} from '../services/chat.service.js'
import {
  getSessionMessages,
  listSessions,
  updateSessionTitle,
  deleteSession,
  deleteAllSessions,
} from '../services/session.service.js'
import { getChatConfig } from '../services/config.service.js'

const providerSchema = z.literal('gemini')

const sendMessageSchema = z.object({
  sessionId: z.string().min(1).optional(),
  content: z.string().optional(),
  provider: z.enum(['gemini', 'opencode']).default('gemini'),
  model: z.string().min(1).optional(),
  memoryMode: z.enum(['session', 'global', 'hybrid']).optional(),
  agent: z.string().min(1).optional(),
  attachments: z.array(z.string()).optional(),
})

function getUserId(request: Request) {
  return request.auth?.sub
}

function getSessionIdParam(value: unknown) {
  if (Array.isArray(value)) {
    return value[0] || ''
  }

  if (typeof value === 'string') {
    return value
  }

  return ''
}

export async function getConfigHandler(request: Request, response: Response) {
  try {
    const config = await getChatConfig()
    response.status(200).json(config)
  } catch (error) {
    const errorMessage = (error as Error).message || 'Unable to fetch chat configuration'
    response.status(500).json({ message: errorMessage })
  }
}

export async function listSessionsHandler(request: Request, response: Response) {
  const userId = getUserId(request)

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  const sessions = await listSessions(userId)
  response.status(200).json({ sessions })
}

export async function getSessionMessagesHandler(request: Request, response: Response) {
  const userId = getUserId(request)

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const sessionId = getSessionIdParam(request.params.sessionId)
    const session = await getSessionMessages(userId, sessionId)
    response.status(200).json({ session })
  } catch (error) {
    response.status(404).json({ message: (error as Error).message || 'Session not found' })
  }
}

export async function sendMessageHandler(request: Request, response: Response) {
  const userId = getUserId(request)

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const payload = sendMessageSchema.parse(request.body)

    const result = await sendMessage({
      userId,
      sessionId: payload.sessionId,
      content: payload.content || '',
      provider: payload.provider,
      model: payload.model,
      memoryMode: payload.memoryMode,
      agent: payload.agent,
      attachmentIds: payload.attachments,
    })

    response.status(200).json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[chat.send] invalid payload', {
        userId,
        sessionId: request.body?.sessionId,
        provider: request.body?.provider,
        model: request.body?.model,
        memoryMode: request.body?.memoryMode,
        agent: request.body?.agent,
        contentLength: typeof request.body?.content === 'string' ? request.body.content.length : 0,
        errors: error.flatten(),
      })

      response.status(400).json({ message: 'Invalid chat payload', errors: error.flatten() })
      return
    }

    const errorMessage = (error as Error).message || 'Unable to process chat message'

    console.error('[chat.send] failed', {
      userId,
      sessionId: request.body?.sessionId,
      provider: request.body?.provider,
      model: request.body?.model,
      memoryMode: request.body?.memoryMode,
      agent: request.body?.agent,
      contentLength: typeof request.body?.content === 'string' ? request.body.content.length : 0,
      error: errorMessage,
    })

    response.status(400).json({ message: errorMessage })
  }
}

export async function updateSessionHandler(request: Request, response: Response) {
  const userId = getUserId(request)

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const sessionId = getSessionIdParam(request.params.sessionId)
    const { title } = z.object({ title: z.string().min(1) }).parse(request.body)

    await updateSessionTitle(userId, sessionId, title)
    response.status(200).json({ message: 'Session updated successfully' })
  } catch (error) {
    response.status(400).json({ message: (error as Error).message || 'Unable to update session' })
  }
}

export async function deleteSessionHandler(request: Request, response: Response) {
  const userId = getUserId(request)

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const sessionId = getSessionIdParam(request.params.sessionId)
    await deleteSession(userId, sessionId)
    response.status(200).json({ message: 'Session deleted successfully' })
  } catch (error) {
    response.status(400).json({ message: (error as Error).message || 'Unable to delete session' })
  }
}

export async function deleteAllSessionsHandler(request: Request, response: Response) {
  const userId = getUserId(request)

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    await deleteAllSessions(userId)
    response.status(200).json({ message: 'All sessions deleted successfully' })
  } catch (error) {
    response.status(400).json({ message: (error as Error).message || 'Unable to delete all sessions' })
  }
}
