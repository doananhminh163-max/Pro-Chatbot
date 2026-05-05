import fs from 'node:fs'
import path from 'node:path'
import { env } from './env.js'

function normalizeAbsolutePath(inputPath: string) {
  return path.resolve(inputPath).replace(/[\\\/]+$/, '').toLowerCase()
}

function ensureDirectory(targetPath: string) {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true })
  }
}

function isSameOrNestedPath(basePath: string, candidatePath: string) {
  return candidatePath === basePath || candidatePath.startsWith(`${basePath}${path.sep}`)
}

export function validateStorageConfiguration() {
  const userDocsRoot = normalizeAbsolutePath(env.userDocsRoot)
  const sandboxRoot = normalizeAbsolutePath(env.sandboxRoot)

  if (isSameOrNestedPath(userDocsRoot, sandboxRoot) || isSameOrNestedPath(sandboxRoot, userDocsRoot)) {
    throw new Error(
      `Invalid storage configuration: USER_DOCS_ROOT (${env.userDocsRoot}) and SANDBOX_ROOT (${env.sandboxRoot}) must be separate sibling directories, not nested or identical.`,
    )
  }
}

export function ensureStorageDirectories() {
  ensureDirectory(env.userDocsRoot)
  ensureDirectory(env.sandboxRoot)
}
