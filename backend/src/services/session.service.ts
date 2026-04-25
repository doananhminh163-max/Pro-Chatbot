import path from 'node:path'
import fs from 'node:fs'
import { prisma } from '../config/prisma.js'
import { env } from '../config/env.js'

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

export function buildSessionTitle(content: string) {
  const normalized = normalizeWhitespace(content)

  if (!normalized) {
    return 'New conversation'
  }

  if (normalized.length <= 70) {
    return normalized
  }

  return `${normalized.slice(0, 67)}...`
}

export async function resolveSession(userId: string, sessionId?: string, seedContent?: string) {
  if (sessionId) {
    const existing = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    })

    if (!existing) {
      throw new Error('Session not found')
    }

    return existing
  }

  return prisma.chatSession.create({
    data: {
      userId,
      title: buildSessionTitle(seedContent || ''),
    },
  })
}

export async function listSessions(userId: string) {
  const sessions = await prisma.chatSession.findMany({
    where: { userId },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
      messages: {
        take: 1,
      },
    },
  })

  return sessions.map((session) => ({
    id: session.id,
    title: session.title,
    messageCount: session._count.messages,
    lastMessage: session.messages[0]
      ? {
        sender: session.messages[0].sender,
        content: session.messages[0].content,
      }
      : null,
  }))
}

export async function getSessionMessages(userId: string, sessionId: string) {
  const session = await prisma.chatSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
    include: {
      messages: {
        include: {
          documents: true,
        },
      },
      documents: true,
    },
  })

  if (!session) {
    throw new Error('Session not found')
  }

  return {
    id: session.id,
    title: session.title,
    messages: session.messages,
    documents: session.documents,
  }
}

export async function updateSessionTitle(userId: string, sessionId: string, title: string) {
  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, userId },
  })

  if (!session) {
    throw new Error('Session not found')
  }

  return prisma.chatSession.update({
    where: { id: sessionId },
    data: { title: title.trim() || 'Untitled' },
  })
}

export async function deleteSession(userId: string, sessionId: string) {
  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, userId },
  })

  if (!session) {
    throw new Error('Session not found')
  }

  // Xóa thư mục vật lý
  const sessionDir = path.join(env.userDocsRoot, userId, sessionId)
  if (fs.existsSync(sessionDir)) {
    try {
      fs.rmSync(sessionDir, { recursive: true, force: true })
    } catch (err) {
      console.error(`[session.service] Failed to remove directory ${sessionDir}`, err)
    }
  }

  return prisma.chatSession.delete({
    where: { id: sessionId },
  })
}

export async function deleteAllSessions(userId: string) {
  const sessions = await prisma.chatSession.findMany({
    where: { userId },
    select: { id: true }
  })

  // Xóa tất cả thư mục vật lý của các session
  for (const session of sessions) {
    const sessionDir = path.join(env.userDocsRoot, userId, session.id)
    if (fs.existsSync(sessionDir)) {
      try {
        fs.rmSync(sessionDir, { recursive: true, force: true })
      } catch (err) {
        console.error(`[session.service] Failed to remove directory ${sessionDir}`, err)
      }
    }
  }

  return prisma.chatSession.deleteMany({
    where: { userId },
  })
}
