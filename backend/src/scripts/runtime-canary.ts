import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { env } from '../config/env.js'
import { resolveCliCommand } from '../services/cli-command.service.js'
import { getSandboxOpenCodeConfigDir } from '../services/opencode-runtime.service.js'
import { prepareSandboxJob } from '../services/sandbox-workspace.service.js'

async function readJson<T>(targetPath: string) {
  return JSON.parse(await fs.readFile(targetPath, 'utf8')) as T
}

async function ensureRemoved(targetPath: string) {
  if (!targetPath.startsWith(env.sandboxRoot)) {
    throw new Error(`Refusing to delete outside sandbox root: ${targetPath}`)
  }

  await fs.rm(targetPath, { recursive: true, force: true })
}

async function runGeminiCanary(userId: string, sessionId: string) {
  const sentinel = `GEMINI-CANARY-${randomUUID()}`
  const prepared = await prepareSandboxJob({
    userId,
    sessionId,
    provider: 'gemini',
    prompt: `Confirm ${sentinel}`,
    model: 'gemini-2.5-flash',
    preferences: {
      aiLanguage: 'Vietnamese',
      aiTone: 'direct',
      aiResponseLength: 'balanced',
      customInstructions: 'Gemini canary custom user instruction.',
    },
    agentInstructions: {
      id: 'canary-agent',
      name: 'Gemini Canary Agent',
      description: 'Checks AGENTS.md composition',
      systemPrompt: `System prompt sentinel ${sentinel}`,
      skills: [
        {
          id: 'skill-canary',
          name: 'Skill Canary',
          description: 'Skill instruction sentinel',
          instructions: `Skill body sentinel ${sentinel}`,
        },
      ],
      mcps: [
        {
          id: 'gemini:settings:context7',
          provider: 'gemini',
          source: 'settings',
          name: 'context7',
          command: 'npx -y context7-mcp',
        },
      ],
      geminiMcpSettings: {
        context7: {
          command: 'npx',
          args: ['-y', 'context7-mcp'],
        },
      },
      opencodeMcpSettings: {},
    },
    attachments: [],
  })

  const agentsContent = await fs.readFile(prepared.agentsPath, 'utf8')
  assert.match(agentsContent, new RegExp(sentinel))
  assert.match(agentsContent, /Gemini Canary Agent/)
  assert.match(agentsContent, /Skill body sentinel/)

  const settingsPath = path.join(prepared.workspaceDir, '.gemini', 'settings.json')
  const settings = await readJson<Record<string, unknown>>(settingsPath)
  assert.deepEqual((settings.context as { fileName?: string[] })?.fileName, ['AGENTS.md', 'GEMINI.md'])
  assert.ok((settings.mcpServers as Record<string, unknown>)?.context7)

  const invocation = resolveCliCommand('gemini', 'hello-from-canary', 'gemini-2.5-flash')
  assert.ok(invocation.args.includes('--prompt'))
  assert.ok(invocation.args.includes('hello-from-canary'))
}

async function runInternalProcessingCanary(userId: string, sessionId: string) {
  const prepared = await prepareSandboxJob({
    userId,
    sessionId,
    provider: 'gemini',
    prompt: 'Return strict JSON only.',
    model: 'gemini-2.5-flash',
    internalProcessing: true,
    attachments: [],
  })

  const agentsContent = await fs.readFile(prepared.agentsPath, 'utf8')
  assert.match(agentsContent, /internal system processing/i)
  assert.match(agentsContent, /return that format only/i)
  assert.doesNotMatch(agentsContent, /Gemini canary custom user instruction/i)
}

async function runOpenCodeCanary(userId: string, sessionId: string) {
  const sentinel = `OPENCODE-CANARY-${randomUUID()}`
  const prepared = await prepareSandboxJob({
    userId,
    sessionId,
    provider: 'opencode',
    prompt: `Confirm ${sentinel}`,
    model: 'opencode/minimax-m2.5-free',
    preferences: {
      aiLanguage: 'Vietnamese',
      aiTone: 'precise',
      aiResponseLength: 'short',
      customInstructions: 'OpenCode canary custom user instruction.',
    },
    agentInstructions: {
      id: 'canary-agent',
      name: 'OpenCode Canary Agent',
      description: 'Checks AGENTS.md placement',
      systemPrompt: `System prompt sentinel ${sentinel}`,
      skills: [
        {
          id: 'skill-canary',
          name: 'Skill Canary',
          description: 'Skill instruction sentinel',
          instructions: `Skill body sentinel ${sentinel}`,
        },
      ],
      mcps: [
        {
          id: 'opencode:config:context7',
          provider: 'opencode',
          source: 'config',
          name: 'context7',
          command: 'npx -y context7-mcp',
        },
      ],
      geminiMcpSettings: {},
      opencodeMcpSettings: {
        context7: {
          type: 'local',
          command: ['npx', '-y', 'context7-mcp'],
          enabled: true,
        },
      },
    },
    attachments: [],
  })

  const agentsContent = await fs.readFile(prepared.agentsPath, 'utf8')
  assert.match(agentsContent, new RegExp(sentinel))
  assert.match(agentsContent, /OpenCode Canary Agent/)
  assert.match(agentsContent, /Skill body sentinel/)

  const openCodeConfigPath = path.join(getSandboxOpenCodeConfigDir(userId, sessionId), 'opencode.json')
  const openCodeConfig = await readJson<Record<string, unknown>>(openCodeConfigPath)
  assert.ok((openCodeConfig.mcp as Record<string, unknown>)?.context7)

  const invocation = resolveCliCommand('opencode', 'hello-from-canary', 'opencode/minimax-m2.5-free')
  assert.ok(invocation.args.includes('--pure'))
  assert.equal(invocation.args[invocation.args.length - 1], 'hello-from-canary')
}

async function main() {
  const userId = `canary-user-${randomUUID()}`
  const geminiSessionId = `gemini-session-${randomUUID()}`
  const openCodeSessionId = `opencode-session-${randomUUID()}`
  const userRoot = path.join(env.sandboxRoot, userId)

  try {
    await runGeminiCanary(userId, geminiSessionId)
    await runInternalProcessingCanary(userId, `internal-session-${randomUUID()}`)
    await runOpenCodeCanary(userId, openCodeSessionId)
    console.log('Runtime canary passed: Gemini and OpenCode both prepare AGENTS.md and provider runtime settings as expected.')
  } finally {
    await ensureRemoved(userRoot)
  }
}

main().catch((error) => {
  console.error('Runtime canary failed.')
  console.error(error)
  process.exitCode = 1
})
