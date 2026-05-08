import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

const STORE_DIR = path.join(process.cwd(), '.runtime-data')
const STORE_PATH = path.join(STORE_DIR, 'agent-audit.json')
const DEFAULT_LIMIT = 40

export type AgentAuditAction = 'CREATE' | 'UPDATE' | 'DELETE'

export interface AgentAuditRecord {
  id: string
  agentId: string
  agentName: string
  action: AgentAuditAction
  actorUserId: string
  actorEmail: string
  createdAt: string
  summary: string
}

function ensureStoreDir() {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true })
  }
}

async function readStore(): Promise<AgentAuditRecord[]> {
  ensureStoreDir()

  if (!fs.existsSync(STORE_PATH)) {
    return []
  }

  try {
    const raw = await fsp.readFile(STORE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as AgentAuditRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeStore(records: AgentAuditRecord[]) {
  ensureStoreDir()
  await fsp.writeFile(STORE_PATH, JSON.stringify(records, null, 2), 'utf8')
}

export async function listAgentAuditRecords(limit = DEFAULT_LIMIT) {
  const records = await readStore()
  return records.slice(0, limit)
}

export async function recordAgentAudit(input: Omit<AgentAuditRecord, 'id' | 'createdAt'>) {
  const records = await readStore()
  const record: AgentAuditRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  }

  records.unshift(record)
  await writeStore(records.slice(0, 250))
  return record
}
