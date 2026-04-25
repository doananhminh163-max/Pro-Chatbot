import type { Request, Response } from 'express'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import { createDocument, listUserDocuments, findDocumentById, deleteDocument, deleteAllUserDocuments } from '../services/document.service.js'
import { env } from '../config/env.js'

// --- Setup Multer Storage ---
const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const userId = req.auth?.sub || 'anonymous'
    const sessionId = req.body.sessionId
    
    // Nếu có sessionId thì vào folder session, nếu không thì ở ngay folder user
    const uploadPath = sessionId 
      ? path.join(env.userDocsRoot, userId, sessionId)
      : path.join(env.userDocsRoot, userId)

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  },
})

export const upload = multer({ storage })

// --- Handlers ---

function getUserId(request: Request) {
  return request.auth?.sub
}

export async function uploadDocumentHandler(request: Request, response: Response) {
  const userId = getUserId(request)
  const file = request.file
  const { sessionId } = request.body

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  if (!file) {
    response.status(400).json({ message: 'No file uploaded' })
    return
  }

  try {
    const document = await createDocument({
      userId,
      sessionId: sessionId || undefined,
      fileName: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      mimeType: file.mimetype,
      size: file.size,
    })

    response.status(201).json(document)
  } catch (error) {
    response.status(500).json({ message: 'Failed to save document' })
  }
}

export async function listDocumentsHandler(request: Request, response: Response) {
  const userId = getUserId(request)

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const documents = await listUserDocuments(userId)
    response.status(200).json(documents)
  } catch (error) {
    response.status(500).json({ message: 'Failed to fetch documents' })
  }
}

export async function downloadDocumentHandler(request: Request, response: Response) {
  const userId = getUserId(request)
  const id = request.params.id as string

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const doc = await findDocumentById(id, userId as string)

    if (!doc) {
      response.status(404).json({ message: 'Document not found' })
      return
    }

    if (!fs.existsSync(doc.filePath)) {
      response.status(404).json({ message: 'File not found on disk' })
      return
    }

    response.download(doc.filePath, doc.originalName)
  } catch (error) {
    response.status(500).json({ message: 'Failed to download document' })
  }
}

export async function previewDocumentHandler(request: Request, response: Response) {
  const userId = getUserId(request)
  const id = request.params.id as string

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const doc = await findDocumentById(id, userId as string)

    if (!doc) {
      response.status(404).json({ message: 'Document not found' })
      return
    }

    if (!fs.existsSync(doc.filePath)) {
      response.status(404).json({ message: 'File not found on disk' })
      return
    }

    // Gửi file về trình duyệt để xem trực tiếp (không ép tải về)
    response.sendFile(doc.filePath)
  } catch (error) {
    response.status(500).json({ message: 'Failed to preview document' })
  }
}

export async function deleteDocumentHandler(request: Request, response: Response) {
  const userId = getUserId(request)
  const id = request.params.id as string

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    await deleteDocument(id, userId as string)
    response.status(200).json({ message: 'Document deleted' })
  } catch (error) {
    response.status(500).json({ message: 'Failed to delete document' })
  }
}

export async function deleteAllDocumentsHandler(request: Request, response: Response) {
  const userId = getUserId(request)

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    await deleteAllUserDocuments(userId as string)
    response.status(200).json({ message: 'All documents deleted' })
  } catch (error) {
    response.status(500).json({ message: 'Failed to delete all documents' })
  }
}
