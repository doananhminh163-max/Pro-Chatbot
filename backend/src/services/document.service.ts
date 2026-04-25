import { prisma } from '../config/prisma.js'
import fs from 'node:fs'

export async function createDocument(data: {
  userId: string
  sessionId?: string
  fileName: string
  originalName: string
  filePath: string
  mimeType: string
  size: number
}) {
  return prisma.document.create({
    data,
  })
}

export async function listUserDocuments(userId: string) {
  return prisma.document.findMany({
    where: { userId },
    include: {
      session: {
        select: {
          title: true,
        },
      },
    },
  })
}

export async function findDocumentById(id: string, userId: string) {
  return prisma.document.findFirst({
    where: { id, userId },
  })
}

export async function deleteDocument(id: string, userId: string) {
  const doc = await prisma.document.findFirst({
    where: { id, userId }
  })

  if (doc && fs.existsSync(doc.filePath)) {
    try {
      fs.unlinkSync(doc.filePath)
    } catch (err) {
      console.error(`[document.service] Failed to delete file ${doc.filePath}`, err)
    }
  }

  return prisma.document.deleteMany({
    where: { id, userId },
  })
}

export async function deleteAllUserDocuments(userId: string) {
  const docs = await prisma.document.findMany({
    where: { userId }
  })

  for (const doc of docs) {
    if (fs.existsSync(doc.filePath)) {
      try {
        fs.unlinkSync(doc.filePath)
      } catch (err) {
        console.error(`[document.service] Failed to delete file ${doc.filePath}`, err)
      }
    }
  }

  return prisma.document.deleteMany({
    where: { userId }
  })
}
