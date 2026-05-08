import fs from 'node:fs'
import path from 'node:path'
import { env } from '../config/env.js'
import type { ChatProvider } from './chat.types.js'

export interface ResolvedCommand {
  executable: string
  args: string[]
  display: string
}

const MODEL_PLACEHOLDER = /\{\{\s*model\s*\}\}|\{model\}|\$MODEL/gi
const BLOCKED_EXECUTABLES = new Set([
  'powershell',
  'powershell.exe',
  'pwsh',
  'pwsh.exe',
  'cmd',
  'cmd.exe',
  'bash',
  'sh',
  'wscript',
  'wscript.exe',
  'cscript',
  'cscript.exe',
])
const SUSPICIOUS_TOKEN_PATTERN = /[|;&><`]/
const WINDOWS_NPM_SHIMS: Record<string, string[]> = {
  gemini: ['node_modules', '@google', 'gemini-cli', 'bundle', 'gemini.js'],
  opencode: ['node_modules', 'opencode-ai', 'bin', 'opencode'],
}

function providerToCommand(provider: ChatProvider) {
  return provider === 'gemini' ? env.geminiCliCommand : env.opencodeCliCommand
}

export function tokenizeCommand(command: string) {
  const tokens = command.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)

  if (!tokens) {
    return []
  }

  return tokens.map((token) => token.replace(/^['"]|['"]$/g, ''))
}

function validateCommandParts(template: string, parts: string[]) {
  if (parts.length === 0) {
    throw new Error(`CLI command is invalid: ${template}`)
  }

  const executableName = path.basename(parts[0]).toLowerCase()

  if (BLOCKED_EXECUTABLES.has(executableName)) {
    throw new Error(`Blocked CLI executable: ${parts[0]}`)
  }

  for (const part of parts) {
    if (SUSPICIOUS_TOKEN_PATTERN.test(part)) {
      throw new Error(`Unsafe CLI token detected in command: ${template}`)
    }
  }
}

function normalizeProviderSpecificArgs(provider: ChatProvider, parts: string[]) {
  const normalized = [...parts]

  if (provider === 'gemini' && normalized[1]?.toLowerCase() === 'chat') {
    normalized.splice(1, 1)
  }

  const cleaned: string[] = []

  for (let index = 0; index < normalized.length; index += 1) {
    const token = normalized[index]
    const lowerToken = token.toLowerCase()

    if (lowerToken === '--prompt' || lowerToken === '-p') {
      index += 1
      continue
    }

    if (lowerToken.startsWith('--prompt=')) {
      continue
    }

    if (lowerToken === '--policy' || lowerToken === '--admin-policy') {
      index += 1
      continue
    }

    if (lowerToken.startsWith('--policy=') || lowerToken.startsWith('--admin-policy=')) {
      continue
    }

    cleaned.push(token)
  }

  return cleaned
}

function findFirstExisting(paths: string[]) {
  for (const candidate of paths) {
    if (fs.existsSync(candidate)) {
      return candidate
    }
  }

  return null
}

function resolveWindowsNpmShim(parts: string[]) {
  if (process.platform !== 'win32' || parts.length === 0) {
    return parts
  }

  const executablePath = parts[0]
  const executableName = path.basename(executablePath).toLowerCase()
  const executableStem = executableName.replace(/\.(cmd|ps1|exe)$/i, '')
  const entrypointSegments = WINDOWS_NPM_SHIMS[executableStem]

  if (!entrypointSegments) {
    return parts
  }

  const shimCandidates: string[] = []

  if (path.isAbsolute(executablePath)) {
    shimCandidates.push(executablePath)
  } else {
    const pathDirs = (process.env.PATH || '').split(path.delimiter).filter(Boolean)

    for (const dir of pathDirs) {
      shimCandidates.push(path.join(dir, executableStem))
      shimCandidates.push(path.join(dir, `${executableStem}.cmd`))
      shimCandidates.push(path.join(dir, `${executableStem}.ps1`))
      shimCandidates.push(path.join(dir, `${executableStem}.exe`))
    }
  }

  const shimPath = findFirstExisting(shimCandidates)

  if (!shimPath) {
    return parts
  }

  const shimDir = path.dirname(shimPath)
  const entrypoint = path.join(shimDir, ...entrypointSegments)

  if (!fs.existsSync(entrypoint)) {
    return parts
  }

  return [process.execPath, entrypoint, ...parts.slice(1)]
}

export function resolveCliCommand(
  provider: ChatProvider,
  prompt: string,
  model?: string,
): ResolvedCommand {
  const template = providerToCommand(provider).trim()

  if (!template) {
    throw new Error(`${provider} CLI command is empty`)
  }

  let command = template
  let modelPlaceholderUsed = false
  const hasModelPlaceholder = /\{\{\s*model\s*\}\}|\{model\}|\$MODEL/i.test(command)

  if (model && hasModelPlaceholder) {
    command = command.replace(MODEL_PLACEHOLDER, model)
    modelPlaceholderUsed = true
  }

  if (!model && hasModelPlaceholder) {
    command = command
      .replace(/\s--model(?:=|\s+)(\{\{\s*model\s*\}\}|\{model\}|\$MODEL)/gi, '')
      .replace(MODEL_PLACEHOLDER, '')
      .trim()
  }

  const parts = normalizeProviderSpecificArgs(
    provider,
    resolveWindowsNpmShim(tokenizeCommand(command)),
  )
  validateCommandParts(template, parts)

  const hasModelFlag = parts.some((part) => part === '--model' || part.startsWith('--model='))

  if (model && !hasModelFlag && !modelPlaceholderUsed) {
    parts.push('--model', model)
  }

  if (provider === 'gemini') {
    parts.push('--prompt', prompt)
  } else {
    if (!parts.includes('--pure')) {
      parts.push('--pure')
    }
    parts.push(prompt)
  }

  return {
    executable: parts[0],
    args: parts.slice(1),
    display: [parts[0], ...parts.slice(1)].join(' '),
  }
}
