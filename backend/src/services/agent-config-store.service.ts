import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

const STORE_DIR = path.join(process.cwd(), '.runtime-data')
const STORE_PATH = path.join(STORE_DIR, 'agent-config.json')

interface AgentConfigRecord {
  selectedSkillIds: string[]
  selectedMcpToolIds: string[]
  updatedAt: string
}

type AgentConfigStore = Record<string, AgentConfigRecord>

function ensureStoreDir() {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true })
  }
}

async function readStore(): Promise<AgentConfigStore> {
  ensureStoreDir()

  if (!fs.existsSync(STORE_PATH)) {
    return {}
  }

  try {
    const raw = await fsp.readFile(STORE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as AgentConfigStore
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

async function writeStore(store: AgentConfigStore) {
  ensureStoreDir()
  await fsp.writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf8')
}

export async function getAgentConfigMap() {
  return readStore()
}

export async function getAgentStoredConfig(agentId: string) {
  const store = await readStore()
  return store[agentId] || {
    selectedSkillIds: [],
    selectedMcpToolIds: [],
    updatedAt: new Date(0).toISOString(),
  }
}

export async function updateAgentStoredConfig(input: {
  agentId: string
  selectedSkillIds: string[]
  selectedMcpToolIds: string[]
}) {
  const store = await readStore()

  store[input.agentId] = {
    selectedSkillIds: input.selectedSkillIds,
    selectedMcpToolIds: input.selectedMcpToolIds,
    updatedAt: new Date().toISOString(),
  }

  await writeStore(store)
  return store[input.agentId]
}

export async function deleteAgentStoredConfig(agentId: string) {
  const store = await readStore()

  if (!(agentId in store)) {
    return false
  }

  delete store[agentId]
  await writeStore(store)
  return true
}
