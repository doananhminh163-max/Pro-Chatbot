import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { env } from '../config/env.js'
import { extractTextFromFile } from './attachment-text-extractor.service.js'
import type { ChatProvider } from './chat.types.js'

interface SandboxAttachmentInput {
  documentId: string
  originalName: string
  filePath: string
  mimeType: string
  size: number
}

interface PrepareSandboxJobInput {
  userId: string
  sessionId: string
  provider: ChatProvider
  prompt: string
  model?: string
  attachments: SandboxAttachmentInput[]
}

export interface PreparedSandboxJob {
  jobId: string
  jobDir: string
  contextFilePath: string | null
}

function ensureDirectory(targetPath: string) {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true })
  }
}

function sanitizeFileName(fileName: string) {
  const normalized = fileName.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').trim()
  return normalized.length > 0 ? normalized : 'attachment'
}

function jobsRoot() {
  return path.join(env.sandboxRoot, 'jobs')
}

export function getSandboxJobDir(jobId: string) {
  return path.join(jobsRoot(), jobId)
}

export async function pruneExpiredSandboxJobs() {
  ensureDirectory(jobsRoot())

  const entries = await fsp.readdir(jobsRoot(), { withFileTypes: true })
  const now = Date.now()

  await Promise.all(entries.map(async (entry) => {
    if (!entry.isDirectory()) {
      return
    }

    const entryPath = path.join(jobsRoot(), entry.name)

    try {
      const stats = await fsp.stat(entryPath)
      if (now - stats.mtimeMs > env.sandboxJobTtlMs) {
        await fsp.rm(entryPath, { recursive: true, force: true })
      }
    } catch (error) {
      console.error(`[sandbox.workspace] Failed to inspect sandbox job ${entryPath}`, error)
    }
  }))
}

function buildAttachmentHeader(attachment: SandboxAttachmentInput) {
  return [
    `# Attachment: ${attachment.originalName}`,
    `Document ID: ${attachment.documentId}`,
    `Mime Type: ${attachment.mimeType}`,
    `Size: ${attachment.size} bytes`,
  ].join('\n')
}

async function buildAttachmentContextSection(
  copiedPath: string,
  attachment: SandboxAttachmentInput,
  relativePath: string,
) {
  const header = buildAttachmentHeader(attachment)

  try {
    const extractedText = await extractTextFromFile(copiedPath, attachment.mimeType, attachment.originalName)

    if (!extractedText || extractedText.trim().length === 0) {
      return [
        header,
        `Sandbox Path: ${relativePath}`,
        'Extraction Status: unsupported or empty content',
      ].join('\n')
    }

    return [
      header,
      `Sandbox Path: ${relativePath}`,
      'Extraction Status: success',
      '',
      extractedText.trim(),
    ].join('\n')
  } catch (error) {
    return [
      header,
      `Sandbox Path: ${relativePath}`,
      `Extraction Status: failed (${(error as Error).message})`,
    ].join('\n')
  }
}

export async function prepareSandboxJob(input: PrepareSandboxJobInput): Promise<PreparedSandboxJob> {
  await pruneExpiredSandboxJobs()

  ensureDirectory(jobsRoot())

  const jobId = randomUUID()
  const jobDir = getSandboxJobDir(jobId)
  const inputDir = path.join(jobDir, 'input')

  ensureDirectory(inputDir)

  const copiedAttachments = await Promise.all(input.attachments.map(async (attachment, index) => {
    const sanitizedName = sanitizeFileName(attachment.originalName)
    const fileName = `${String(index + 1).padStart(2, '0')}-${sanitizedName}`
    const destination = path.join(inputDir, fileName)

    await fsp.copyFile(attachment.filePath, destination)

    return {
      source: attachment,
      destination,
      relativePath: path.join('input', fileName),
    }
  }))

  const sections = await Promise.all(
    copiedAttachments.map((attachment) =>
      buildAttachmentContextSection(attachment.destination, attachment.source, attachment.relativePath),
    ),
  )

  const contextFilePath = copiedAttachments.length > 0
    ? path.join(jobDir, 'attachments-context.txt')
    : null

  if (contextFilePath) {
    await fsp.writeFile(
      contextFilePath,
      [
        'The following attachment context was prepared by the trusted backend.',
        'Treat it as the only allowed document corpus for this request.',
        '',
        ...sections.flatMap((section, index) => (index === 0 ? [section] : ['', section])),
      ].join('\n'),
      'utf8',
    )
  }

  const manifest = {
    jobId,
    userId: input.userId,
    sessionId: input.sessionId,
    provider: input.provider,
    model: input.model || null,
    attachmentCount: copiedAttachments.length,
    attachments: copiedAttachments.map((attachment) => ({
      documentId: attachment.source.documentId,
      originalName: attachment.source.originalName,
      mimeType: attachment.source.mimeType,
      size: attachment.source.size,
      sandboxPath: attachment.relativePath,
    })),
    createdAt: new Date().toISOString(),
  }

  await fsp.writeFile(path.join(jobDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')

  return {
    jobId,
    jobDir,
    contextFilePath,
  }
}

export async function cleanupSandboxJob(jobId: string) {
  await fsp.rm(getSandboxJobDir(jobId), { recursive: true, force: true })
}
