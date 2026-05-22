import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DEFAULT_HOSTNAME = '127.0.0.1'
const DEFAULT_PORT = 4096
const STARTUP_TIMEOUT_MS = 15000
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const BACKEND_ROOT = path.resolve(SCRIPT_DIR, '..')

function workspaceRoot() {
  return path.resolve(BACKEND_ROOT, '..')
}

function stripJsonComments(input) {
  let output = ''
  let inString = false
  let quote = ''
  let escaped = false

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]
    const next = input[index + 1]

    if (inString) {
      output += char
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === quote) inString = false
      continue
    }

    if (char === '"' || char === "'") {
      inString = true
      quote = char
      output += char
      continue
    }

    if (char === '/' && next === '/') {
      while (index < input.length && input[index] !== '\n') index += 1
      output += '\n'
      continue
    }

    if (char === '/' && next === '*') {
      index += 2
      while (index < input.length && !(input[index] === '*' && input[index + 1] === '/')) index += 1
      index += 1
      continue
    }

    output += char
  }

  return output.replace(/,\s*([}\]])/g, '$1')
}

function projectServerConfig() {
  for (const filename of ['opencode.json', 'opencode.jsonc']) {
    const targetPath = path.join(workspaceRoot(), filename)
    if (!existsSync(targetPath)) continue
    try {
      const config = JSON.parse(stripJsonComments(readFileSync(targetPath, 'utf8')))
      const server = config.server && typeof config.server === 'object' && !Array.isArray(config.server) ? config.server : {}
      return {
        hostname: typeof server.hostname === 'string' && server.hostname.trim() ? server.hostname.trim() : DEFAULT_HOSTNAME,
        port: Number(server.port) || DEFAULT_PORT,
      }
    } catch {
      return { hostname: DEFAULT_HOSTNAME, port: DEFAULT_PORT }
    }
  }
  return { hostname: DEFAULT_HOSTNAME, port: DEFAULT_PORT }
}

function connectHostname(hostname) {
  if (hostname === '0.0.0.0' || hostname === '::') return DEFAULT_HOSTNAME
  return hostname
}

function baseUrl() {
  const target = projectServerConfig()
  const hostname = connectHostname(target.hostname)
  const host = hostname.includes(':') && !hostname.startsWith('[') ? `[${hostname}]` : hostname
  return `http://${host}:${target.port}`
}

async function health(timeoutMs = 2000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`${baseUrl()}/global/health`, {
      method: 'GET',
      signal: controller.signal,
    })
    if (response.status === 401) return 'unauthorized'
    return response.ok ? 'online' : `http_${response.status}`
  } catch {
    return 'offline'
  } finally {
    clearTimeout(timeout)
  }
}

function opencodeChildEnv() {
  const env = { ...process.env }
  delete env.OPENCODE_SERVER_URL
  delete env.OPENCODE_SERVER_PORT
  delete env.OPENCODE_SERVER_USERNAME
  delete env.OPENCODE_SERVER_PASSWORD
  delete env.OPENCODE_SERVER_TOKEN
  return env
}

function spawnCommand() {
  if (process.platform !== 'win32') return { command: 'opencode', args: [] }

  const appData = process.env.APPDATA
  const windowsBinary = appData ? path.join(appData, 'npm', 'node_modules', 'opencode-windows-x64', 'bin', 'opencode.exe') : ''
  if (windowsBinary && existsSync(windowsBinary)) {
    return { command: windowsBinary, args: [] }
  }

  const opencodeAiScript = appData ? path.join(appData, 'npm', 'node_modules', 'opencode-ai', 'bin', 'opencode') : ''
  if (opencodeAiScript && existsSync(opencodeAiScript)) {
    return { command: process.execPath, args: [opencodeAiScript] }
  }

  return { command: 'opencode.cmd', args: [] }
}

function keepAlive() {
  setInterval(() => {}, 60_000)
}

const initialStatus = await health()
if (initialStatus === 'online') {
  console.log(`[opencode] Reusing existing server at ${baseUrl()}`)
  keepAlive()
} else if (initialStatus === 'unauthorized') {
  console.error(`[opencode] Server at ${baseUrl()} requires authentication. Stop that process and restart it so opencode.json is used.`)
  process.exit(1)
} else {
  const executable = spawnCommand()
  const args = [
    ...executable.args,
    'serve',
  ]

  console.log(`[opencode] Starting ${executable.command} ${args.join(' ')}`)
  const child = spawn(executable.command, args, {
    cwd: workspaceRoot(),
    env: opencodeChildEnv(),
    stdio: 'inherit',
    windowsHide: true,
  })

  const deadline = Date.now() + STARTUP_TIMEOUT_MS
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const status = await health(1500)
    if (status === 'online') {
      console.log(`[opencode] Server ready at ${baseUrl()}`)
      break
    }
    if (status === 'unauthorized') {
      console.error('[opencode] Server started with authentication enabled. Check that the OpenCode process is not receiving server auth environment variables.')
      child.kill()
      process.exit(1)
    }
  }

  child.on('exit', (code, signal) => {
    if (signal) console.log(`[opencode] exited with signal ${signal}`)
    process.exit(code ?? 0)
  })

  child.on('error', (error) => {
    console.error('[opencode] failed to start', error)
    process.exit(1)
  })
}
