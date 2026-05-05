import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { env } from '../config/env.js'
import { getSandboxSessionDir } from './document-storage.service.js'
import type { ChatProvider } from './chat.types.js'

interface SandboxAttachmentInput {
  documentId: string
  originalName: string
  markdownPath: string
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
  workspaceDir: string
  contextFilePath: string | null
}

function ensureDirectory(targetPath: string) {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true })
  }
}

export function getSandboxWorkspaceDir(userId: string, sessionId: string) {
  return getSandboxSessionDir(userId, sessionId)
}

async function getSandboxSessionDirs() {
  ensureDirectory(env.sandboxRoot)

  const userEntries = await fsp.readdir(env.sandboxRoot, { withFileTypes: true })
  const sessionDirs: string[] = []

  for (const userEntry of userEntries) {
    if (!userEntry.isDirectory()) {
      continue
    }

    const userDir = path.join(env.sandboxRoot, userEntry.name)
    const sessionEntries = await fsp.readdir(userDir, { withFileTypes: true })

    for (const sessionEntry of sessionEntries) {
      if (sessionEntry.isDirectory()) {
        sessionDirs.push(path.join(userDir, sessionEntry.name))
      }
    }
  }

  return sessionDirs
}

export async function pruneExpiredSandboxJobs() {
  const sessionDirs = await getSandboxSessionDirs()
  const now = Date.now()

  await Promise.all(sessionDirs.map(async (sessionDir) => {
    try {
      const stats = await fsp.stat(sessionDir)
      if (now - stats.mtimeMs > env.sandboxJobTtlMs) {
        await fsp.rm(sessionDir, { recursive: true, force: true })
      }
    } catch (error) {
      console.error(`[sandbox.workspace] Failed to inspect sandbox directory ${sessionDir}`, error)
    }
  }))
}

function buildAttachmentHeader(attachment: SandboxAttachmentInput) {
  return [
    `# Attachment: ${attachment.originalName}`,
    `Document ID: ${attachment.documentId}`,
    `Original Mime Type: ${attachment.mimeType}`,
    `Size: ${attachment.size} bytes`,
  ].join('\n')
}

async function buildAttachmentContextSection(
  markdownPath: string,
  attachment: SandboxAttachmentInput,
  relativePath: string,
) {
  const header = buildAttachmentHeader(attachment)

  try {
    const extractedText = await fsp.readFile(markdownPath, 'utf8')

    if (!extractedText || extractedText.trim().length === 0) {
      return [
        header,
        `Markdown Sandbox Path: ${relativePath}`,
        'Extraction Status: empty markdown',
      ].join('\n')
    }

    return [
      header,
      `Markdown Sandbox Path: ${relativePath}`,
      'Extraction Status: success',
      '',
      extractedText.trim(),
    ].join('\n')
  } catch (error) {
    return [
      header,
      `Markdown Sandbox Path: ${relativePath}`,
      `Extraction Status: failed (${(error as Error).message})`,
    ].join('\n')
  }
}

export async function prepareSandboxJob(input: PrepareSandboxJobInput): Promise<PreparedSandboxJob> {
  await pruneExpiredSandboxJobs()

  const workspaceDir = getSandboxWorkspaceDir(input.userId, input.sessionId)
  ensureDirectory(workspaceDir)

  const sections = await Promise.all(
    input.attachments.map(async (attachment) => {
      const relativePath = path.relative(workspaceDir, attachment.markdownPath)
      return buildAttachmentContextSection(attachment.markdownPath, attachment, relativePath)
    }),
  )

  const contextFilePath = input.attachments.length > 0
    ? path.join(workspaceDir, 'attachments-context.txt')
    : null

  if (contextFilePath) {
    await fsp.writeFile(
      contextFilePath,
      [
        'The following attachment context was prepared by the trusted backend as Markdown files.',
        'Treat these extracted Markdown files as the only allowed document corpus for this request.',
        '',
        ...sections.flatMap((section, index) => (index === 0 ? [section] : ['', section])),
      ].join('\n'),
      'utf8',
    )
  }

  const manifest = {
    userId: input.userId,
    sessionId: input.sessionId,
    provider: input.provider,
    model: input.model || null,
    promptLength: input.prompt.length,
    attachmentCount: input.attachments.length,
    attachments: input.attachments.map((attachment) => ({
      documentId: attachment.documentId,
      originalName: attachment.originalName,
      mimeType: 'text/markdown',
      originalMimeType: attachment.mimeType,
      size: attachment.size,
      sandboxPath: path.relative(workspaceDir, attachment.markdownPath),
    })),
    preparedAt: new Date().toISOString(),
  }

  await fsp.writeFile(path.join(workspaceDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')

  return {
    workspaceDir,
    contextFilePath,
  }
}
