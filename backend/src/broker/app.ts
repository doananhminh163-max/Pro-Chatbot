import express from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { z } from 'zod'
import { env } from '../config/env.js'
import { ensureStorageDirectories, validateStorageConfiguration } from '../config/storage.js'
import { resolveCliCommand } from '../services/cli-command.service.js'
import { getSandboxWorkspaceDir, pruneExpiredSandboxJobs } from '../services/sandbox-workspace.service.js'
import type { ChatProvider } from '../services/chat.types.js'

const executeSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  provider: z.enum(['gemini', 'opencode']),
  prompt: z.string().min(1),
  model: z.string().min(1).optional(),
})

validateStorageConfiguration()
ensureStorageDirectories()

function stripAnsi(value: string) {
  return value.replace(/\u001b\[[0-9;]*m/g, '')
}

function redactSensitivePaths(value: string) {
  return value.replace(/[A-Za-z]:\\[^\s"'<>|]+(?:\\[^\s"'<>|]+)*/g, '[REDACTED_PATH]')
}

function isLoopbackAddress(address?: string | null) {
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1'
}

function requireInternalAuth(request: express.Request, response: express.Response, next: express.NextFunction) {
  if (!isLoopbackAddress(request.socket.remoteAddress)) {
    response.status(403).json({ message: 'Sandbox broker accepts loopback requests only' })
    return
  }

  if (request.header('x-sandbox-broker-token') !== env.sandboxBrokerToken) {
    response.status(401).json({ message: 'Sandbox broker token is invalid' })
    return
  }

  next()
}

function sanitizeChildEnv() {
  const childEnv: Record<string, string> = {}
  const allowList = [
    'PATH',
    'SystemRoot',
    'COMSPEC',
    'PATHEXT',
    'TEMP',
    'TMP',
    'USERPROFILE',
    'HOMEDRIVE',
    'HOMEPATH',
    'APPDATA',
    'LOCALAPPDATA',
  ]

  for (const key of allowList) {
    const value = process.env[key]
    if (value) {
      childEnv[key] = value
    }
  }

  return childEnv
}

async function executeSandboxCli(
  provider: ChatProvider,
  prompt: string,
  userId: string,
  sessionId: string,
  model?: string,
) {
  const command = resolveCliCommand(provider, prompt, model)
  const workspaceDir = getSandboxWorkspaceDir(userId, sessionId)
  const contextFile = path.join(workspaceDir, 'attachments-context.txt')

  let stdinPayload = ''

  try {
    stdinPayload = await fs.readFile(contextFile, 'utf8')
  } catch {
    stdinPayload = ''
  }

  return new Promise<string>((resolve, reject) => {
    const processHandle = spawn(command.executable, command.args, {
      shell: false,
      windowsHide: true,
      cwd: workspaceDir,
      env: sanitizeChildEnv(),
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''
    let timedOut = false

    const timeout = env.cliTimeoutMs > 0
      ? setTimeout(() => {
        timedOut = true
        processHandle.kill('SIGTERM')
      }, env.cliTimeoutMs)
      : null

    processHandle.stdout.on('data', (chunk: Buffer | string) => {
      stdout += chunk.toString()
    })

    processHandle.stderr.on('data', (chunk: Buffer | string) => {
      stderr += chunk.toString()
    })

    processHandle.on('error', (error) => {
      if (timeout) {
        clearTimeout(timeout)
      }

      reject(error)
    })

    processHandle.on('close', (code) => {
      if (timeout) {
        clearTimeout(timeout)
      }

      if (timedOut) {
        reject(new Error(`${provider} CLI timed out after ${env.cliTimeoutMs}ms`))
        return
      }

      const output = redactSensitivePaths(stripAnsi((stdout || '').trim()))
      const errorOutput = redactSensitivePaths(stripAnsi((stderr || '').trim()))

      if (code !== 0) {
        reject(new Error(errorOutput || output || `${provider} CLI exited with code ${code ?? 'unknown'}`))
        return
      }

      const resolvedOutput = output || errorOutput

      if (!resolvedOutput) {
        reject(new Error(`${provider} CLI returned empty output`))
        return
      }

      resolve(resolvedOutput)
    })

    if (stdinPayload) {
      processHandle.stdin.write(stdinPayload)
    }

    processHandle.stdin.end()
  })
}

const app = express()

app.use(express.json({ limit: '1mb' }))

app.get('/health', async (_request, response) => {
  await pruneExpiredSandboxJobs()
  response.status(200).json({ status: 'ok' })
})

app.post('/internal/jobs/execute', requireInternalAuth, async (request, response) => {
  try {
    await pruneExpiredSandboxJobs()

    const payload = executeSchema.parse(request.body)
    const workspaceDir = getSandboxWorkspaceDir(payload.userId, payload.sessionId)
    await fs.access(workspaceDir)

    const reply = await executeSandboxCli(
      payload.provider,
      payload.prompt,
      payload.userId,
      payload.sessionId,
      payload.model,
    )

    response.status(200).json({
      reply,
      usedProvider: payload.provider,
      fallbackUsed: false,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status(400).json({ message: 'Invalid sandbox execute payload', errors: error.flatten() })
      return
    }

    response.status(400).json({ message: (error as Error).message || 'Sandbox execution failed' })
  }
})

app.listen(env.sandboxBrokerPort, env.sandboxBrokerHost, () => {
  console.log(`[sandbox-broker]: listening on http://${env.sandboxBrokerHost}:${env.sandboxBrokerPort}`)
})
