import type { Request, Response } from 'express'
import multer from 'multer'
import fs from 'node:fs'
import {
  createDocument,
  listUserDocuments,
  findDocumentById,
  deleteDocument,
  deleteAllUserDocuments,
} from '../services/document.service.js'
import { ensureSandboxMarkdownForDocument, getStoreSessionDir } from '../services/document-storage.service.js'

const MAX_UPLOAD_FILE_SIZE = 20 * 1024 * 1024

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const userId = req.auth?.sub || 'anonymous'
    const sessionId = req.body.sessionId
    const uploadPath = getStoreSessionDir(userId, sessionId)

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

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_UPLOAD_FILE_SIZE,
  },
})

export function uploadSingleDocument(request: Request, response: Response, next: (error?: unknown) => void) {
  upload.single('file')(request, response, (error) => {
    if (!error) {
      next()
      return
    }

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      response.status(400).json({
        message: 'File uploads are limited to 20 MB per file.',
      })
      return
    }

    next(error)
  })
}

function getUserId(request: Request) {
  return request.auth?.sub
}

function cleanupUploadedFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return
  }

  try {
    fs.unlinkSync(filePath)
  } catch (error) {
    console.error(`[document.controller] Failed to cleanup uploaded file ${filePath}`, error)
  }
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

    try {
      await ensureSandboxMarkdownForDocument({
        userId,
        sessionId: sessionId || undefined,
        documentId: document.id,
        originalName: document.originalName,
        filePath: document.filePath,
        mimeType: document.mimeType,
      })
    } catch (error) {
      await deleteDocument(document.id, userId)
      throw error
    }

    response.status(201).json(document)
  } catch (error) {
    cleanupUploadedFile(file.path)
    response.status(400).json({ message: (error as Error).message || 'Failed to extract document to markdown' })
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
  } catch {
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
  } catch {
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

    response.sendFile(doc.filePath)
  } catch {
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
  } catch {
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
  } catch {
    response.status(500).json({ message: 'Failed to delete all documents' })
  }
}
