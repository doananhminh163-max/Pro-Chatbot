import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { getSandboxUserDir } from './sandbox-policy.service.js'

function ensureDirectory(targetPath: string) {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true })
  }
}

async function writeFileIfChanged(targetPath: string, content: string) {
  try {
    const existing = await fsp.readFile(targetPath, 'utf8')
    if (existing === content) {
      return
    }
  } catch {
    // File does not exist yet.
  }

  await fsp.writeFile(targetPath, content, 'utf8')
}

async function copyFileIfChanged(sourcePath: string, targetPath: string) {
  try {
    const [source, target] = await Promise.all([
      fsp.readFile(sourcePath),
      fsp.readFile(targetPath).catch(() => null),
    ])

    if (target && Buffer.compare(source, target) === 0) {
      return
    }

    await fsp.writeFile(targetPath, source)
  } catch {
    // Ignore missing optional runtime files such as auth.json.
  }
}

function buildOpenCodeConfig(mcpSettings?: Record<string, unknown>) {
  return JSON.stringify({
    $schema: 'https://opencode.ai/config.json',
    snapshot: false,
    autoupdate: false,
    plugin: [],
    ...(mcpSettings && Object.keys(mcpSettings).length > 0 ? { mcp: mcpSettings } : {}),
  }, null, 2)
}

export function getSandboxOpenCodeHomeDir(userId: string, sessionId: string) {
  return path.join(getSandboxUserDir(userId), sessionId, 'opencode-home')
}

export function getSandboxOpenCodeConfigDir(userId: string, sessionId: string) {
  return path.join(getSandboxOpenCodeHomeDir(userId, sessionId), '.config', 'opencode')
}

export function getSandboxOpenCodeDataDir(userId: string, sessionId: string) {
  return path.join(getSandboxOpenCodeHomeDir(userId, sessionId), '.local', 'share', 'opencode')
}

export async function ensureOpenCodeRuntime(
  userId: string,
  sessionId: string,
  mcpSettings?: Record<string, unknown>,
) {
  const homeDir = getSandboxOpenCodeHomeDir(userId, sessionId)
  const configDir = getSandboxOpenCodeConfigDir(userId, sessionId)
  const dataDir = getSandboxOpenCodeDataDir(userId, sessionId)
  const configPath = path.join(configDir, 'opencode.json')
  const authPath = path.join(dataDir, 'auth.json')
  const sourceAuthPath = process.env.USERPROFILE
    ? path.join(process.env.USERPROFILE, '.local', 'share', 'opencode', 'auth.json')
    : ''

  ensureDirectory(homeDir)
  ensureDirectory(configDir)
  ensureDirectory(dataDir)
  ensureDirectory(path.join(homeDir, 'AppData', 'Roaming'))
  ensureDirectory(path.join(homeDir, 'AppData', 'Local'))

  await Promise.all([
    writeFileIfChanged(configPath, buildOpenCodeConfig(mcpSettings)),
    sourceAuthPath ? copyFileIfChanged(sourceAuthPath, authPath) : Promise.resolve(),
  ])

  return {
    homeDir,
    configDir,
    configPath,
    dataDir,
  }
}
