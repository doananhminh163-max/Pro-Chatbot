import { prisma } from '../config/prisma.js'
import { relocateDocumentAssets } from './document-storage.service.js'

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

export async function resolveSession(userId: string, sessionId?: string, seedContent?: string, agentId?: string | null) {
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

    if (agentId !== undefined && existing.agentId !== agentId) {
      return prisma.chatSession.update({
        where: {
          id: existing.id,
        },
        data: {
          agentId,
        },
      })
    }

    return existing
  }

  return prisma.chatSession.create({
    data: {
      userId,
      agentId: agentId || null,
      title: buildSessionTitle(seedContent || ''),
    },
  })
}

export async function listSessions(userId: string) {
  const sessions = await prisma.chatSession.findMany({
    where: { userId },
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
      messages: {
        take: 1,
        orderBy: {
          createdAt: 'desc',
        },
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
        orderBy: {
          createdAt: 'asc',
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

async function relocateSessionDocumentsToGeneral(userId: string, sessionId: string) {
  const documents = await prisma.document.findMany({
    where: {
      userId,
      sessionId,
    },
  })

  for (const document of documents) {
    const relocated = await relocateDocumentAssets({
      userId,
      fromSessionId: sessionId,
      toSessionId: null,
      documentId: document.id,
      originalName: document.originalName,
      fileName: document.fileName,
      currentFilePath: document.filePath,
      mimeType: document.mimeType,
    })

    await prisma.document.update({
      where: { id: document.id },
      data: {
        sessionId: null,
        filePath: relocated.filePath,
      },
    })
  }
}

export async function deleteSession(userId: string, sessionId: string) {
  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, userId },
  })

  if (!session) {
    throw new Error('Session not found')
  }

  await relocateSessionDocumentsToGeneral(userId, sessionId)

  return prisma.chatSession.delete({
    where: { id: sessionId },
  })
}

export async function deleteAllSessions(userId: string) {
  const sessions = await prisma.chatSession.findMany({
    where: { userId },
    select: { id: true },
  })

  for (const session of sessions) {
    await relocateSessionDocumentsToGeneral(userId, session.id)
  }

  return prisma.chatSession.deleteMany({
    where: { userId },
  })
}
