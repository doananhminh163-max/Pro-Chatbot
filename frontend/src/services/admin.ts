import { adminEndpoints, http } from './http'

export interface AdminOverview {
  userCount: number
  sessionCount: number
  documentCount: number
  agentCount: number
  providerCount: number
  failedExecutions: number
}

export interface AdminUserRecord {
  id: string
  username: string | null
  fullName: string | null
  email: string
  role: 'CLIENT' | 'ADMIN'
  documentCount: number
  sessionCount: number
  memoryCount: number
  storageBytes: number
  storageLabel: string
  lastSeenAt: string | null
}

export interface AdminProviderRecord {
  id: string
  name: string
  config: string | null
  modelCount: number
  models: Array<{
    id: string
    name: string
  }>
}

export interface AdminSkillCatalogItem {
  id: string
  name: string
  description: string
  path: string
}

export interface AdminMcpCatalogItem {
  id: string
  provider: 'gemini' | 'opencode'
  source: string
  name: string
  command: string
  enabled: boolean
}

export interface AdminAgentRecord {
  id: string
  name: string
  description: string | null
  systemPrompt: string | null
  selectedSkillIds: string[]
  selectedMcpToolIds: string[]
  sessionCount: number
  updatedAt: string | null
}

export interface AdminAgentAuditRecord {
  id: string
  agentId: string
  agentName: string
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  actorUserId: string
  actorEmail: string
  createdAt: string
  summary: string
}

export interface AdminRuntimeConfig {
  commands: {
    gemini: string
    opencode: string
  }
  sandbox: {
    root: string
    ttlMs: number
    brokerUrl: string
    requestTimeoutMs: number
  }
  storage: {
    userDocsRoot: string
  }
}

export interface AdminLogRecord {
  id: string
  createdAt: string
  level: 'INFO' | 'ERROR'
  message: string
  sessionId: string
  sessionTitle: string
  userEmail: string
  agentName: string | null
}

export async function fetchAdminOverview() {
  const response = await http.get<{ overview: AdminOverview }>(adminEndpoints.overview)
  return response.data.overview
}

export async function fetchAdminUsers() {
  const response = await http.get<{ users: AdminUserRecord[] }>(adminEndpoints.users)
  return response.data.users
}

export async function fetchAdminProviders() {
  const response = await http.get<{ providers: AdminProviderRecord[] }>(adminEndpoints.providers)
  return response.data.providers
}

export async function fetchAdminAgents() {
  const response = await http.get<{
    agents: AdminAgentRecord[]
    skills: AdminSkillCatalogItem[]
    mcps: AdminMcpCatalogItem[]
    audit: AdminAgentAuditRecord[]
  }>(adminEndpoints.agents)

  return response.data
}

export async function createAdminAgent(payload: {
  name: string
  description?: string | null
  systemPrompt?: string | null
  selectedSkillIds?: string[]
  selectedMcpToolIds?: string[]
}) {
  const response = await http.post<{ agent: AdminAgentRecord }>(adminEndpoints.createAgent, payload)
  return response.data.agent
}

export async function updateAdminAgent(agentId: string, payload: {
  name?: string
  description?: string | null
  systemPrompt?: string | null
  selectedSkillIds?: string[]
  selectedMcpToolIds?: string[]
}) {
  const response = await http.patch<{ agent: AdminAgentRecord }>(adminEndpoints.updateAgent(agentId), payload)
  return response.data.agent
}

export async function deleteAdminAgent(agentId: string) {
  const response = await http.delete<{ agent: { id: string; name: string } }>(adminEndpoints.deleteAgent(agentId))
  return response.data.agent
}

export async function fetchAdminConfig() {
  const response = await http.get<{ config: AdminRuntimeConfig }>(adminEndpoints.config)
  return response.data.config
}

export async function fetchAdminLogs() {
  const response = await http.get<{ logs: AdminLogRecord[] }>(adminEndpoints.logs)
  return response.data.logs
}
