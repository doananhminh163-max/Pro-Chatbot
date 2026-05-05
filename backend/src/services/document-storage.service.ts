import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { env } from '../config/env.js'
import { extractMarkdownFromFile } from './attachment-text-extractor.service.js'

export const DEFAULT_DOCUMENT_SCOPE = 'general'

function ensureDirectory(targetPath: string) {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true })
  }
}

function sanitizeFileName(fileName: string) {
  const normalized = fileName.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').trim()
  return normalized.length > 0 ? normalized : 'attachment'
}

function markdownFileName(documentId: string, originalName: string) {
  const parsed = path.parse(originalName)
  const baseName = sanitizeFileName(parsed.name || parsed.base || 'attachment')
  return `${baseName}--${documentId}.md`
}

async function moveFile(sourcePath: string, targetPath: string) {
  if (sourcePath === targetPath || !fs.existsSync(sourcePath)) {
    return
  }

  try {
    await fsp.rename(sourcePath, targetPath)
  } catch (error) {
    const moveError = error as NodeJS.ErrnoException

    if (moveError.code !== 'EXDEV') {
      throw error
    }

    await fsp.copyFile(sourcePath, targetPath)
    await fsp.unlink(sourcePath)
  }
}

async function removeDirectoryIfEmpty(targetPath: string) {
  if (!fs.existsSync(targetPath)) {
    return
  }

  const entries = await fsp.readdir(targetPath)
  if (entries.length === 0) {
    await fsp.rmdir(targetPath)
  }
}

export function resolveDocumentScope(sessionId?: string | null) {
  return sessionId || DEFAULT_DOCUMENT_SCOPE
}

export function getStoreSessionDir(userId: string, sessionId?: string | null) {
  return path.join(env.userDocsRoot, userId, resolveDocumentScope(sessionId))
}

export function getSandboxSessionDir(userId: string, sessionId?: string | null) {
  return path.join(env.sandboxRoot, userId, resolveDocumentScope(sessionId))
}

export function getSandboxInputDir(userId: string, sessionId?: string | null) {
  return path.join(getSandboxSessionDir(userId, sessionId), 'input')
}

export function getDocumentMarkdownPath(input: {
  userId: string
  sessionId?: string | null
  documentId: string
  originalName: string
}) {
  return path.join(
    getSandboxInputDir(input.userId, input.sessionId),
    markdownFileName(input.documentId, input.originalName),
  )
}

export function ensureDocumentStorageDirs(userId: string, sessionId?: string | null) {
  ensureDirectory(getStoreSessionDir(userId, sessionId))
  ensureDirectory(getSandboxInputDir(userId, sessionId))
}

export async function ensureSandboxMarkdownForDocument(input: {
  userId: string
  sessionId?: string | null
  documentId: string
  originalName: string
  filePath: string
  mimeType: string
}) {
  ensureDocumentStorageDirs(input.userId, input.sessionId)

  const markdownPath = getDocumentMarkdownPath(input)

  if (fs.existsSync(markdownPath)) {
    return markdownPath
  }

  const markdown = await extractMarkdownFromFile(input.filePath, input.mimeType, input.originalName)
  await fsp.writeFile(markdownPath, markdown, 'utf8')

  return markdownPath
}

export async function relocateDocumentAssets(input: {
  userId: string
  fromSessionId?: string | null
  toSessionId?: string | null
  documentId: string
  originalName: string
  fileName: string
  currentFilePath: string
  mimeType: string
}) {
  ensureDocumentStorageDirs(input.userId, input.toSessionId)

  const sourceStoreDir = getStoreSessionDir(input.userId, input.fromSessionId)
  const sourceSandboxDir = getSandboxInputDir(input.userId, input.fromSessionId)
  const targetStoreDir = getStoreSessionDir(input.userId, input.toSessionId)
  const targetSandboxDir = getSandboxInputDir(input.userId, input.toSessionId)

  const sourceMarkdownPath = path.join(sourceSandboxDir, markdownFileName(input.documentId, input.originalName))
  const targetFilePath = path.join(targetStoreDir, input.fileName)
  const targetMarkdownPath = path.join(targetSandboxDir, markdownFileName(input.documentId, input.originalName))

  await moveFile(input.currentFilePath, targetFilePath)
  await moveFile(sourceMarkdownPath, targetMarkdownPath)

  if (!fs.existsSync(targetMarkdownPath)) {
    const markdown = await extractMarkdownFromFile(targetFilePath, input.mimeType, input.originalName)
    await fsp.writeFile(targetMarkdownPath, markdown, 'utf8')
  }

  await Promise.all([
    removeDirectoryIfEmpty(sourceStoreDir),
    removeDirectoryIfEmpty(sourceSandboxDir),
  ])

  return {
    filePath: targetFilePath,
    markdownPath: targetMarkdownPath,
  }
}

export async function deleteDocumentAssets(input: {
  userId: string
  sessionId?: string | null
  documentId: string
  originalName: string
  filePath: string
}) {
  const markdownPath = getDocumentMarkdownPath(input)

  await Promise.all([
    fsp.rm(input.filePath, { force: true }),
    fsp.rm(markdownPath, { force: true }),
  ])

  await Promise.all([
    removeDirectoryIfEmpty(path.dirname(input.filePath)),
    removeDirectoryIfEmpty(path.dirname(markdownPath)),
  ])
}
