import type { AgentDetail, AppState, CommandItem, ConfigChange, ExternalSkillFindResult, GlobalSkillInstallResult, McpInstallResult, McpMarketplaceItem, McpRuntimeCheck, ProjectPathReference, SkillDetail, SnapshotReviewClearResult, WorkingTreeBackupResult, WorkingTreeReview } from '../types/appData'
import { readApiResponse, type ApiResponse } from './apiResponse'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''

export async function fetchAppData(signal?: AbortSignal): Promise<AppState> {
  return apiRequest<AppState>('/api/app-state', { signal })
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormDataBody = typeof FormData !== 'undefined' && options.body instanceof FormData
  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body && !isFormDataBody ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  return readApiResponse<T>(response)
}

function postJson<T>(path: string, body: unknown) {
  return apiRequest<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

function patchJson<T>(path: string, body: unknown) {
  return apiRequest<T>(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function getConfigChange(configChangeId: string) {
  return apiRequest<ConfigChange>(`/api/config-changes/${encodeURIComponent(configChangeId)}`)
}

export function applyConfigChange(configChangeId: string) {
  return postJson<{ configChangeId: string; status: string }>(`/api/config-changes/${encodeURIComponent(configChangeId)}/apply`, {
    confirmed: true,
    confirmationText: 'I understand the risk',
  })
}

export function previewConfigPatch(projectId: string, patch: Record<string, unknown>) {
  return postJson<ConfigChange>(`/api/projects/${encodeURIComponent(projectId)}/config/preview`, {
    type: 'config.update',
    summary: 'Update OpenCode config',
    patch,
  })
}

export function reviewWorkingTreeChanges(projectId: string) {
  return apiRequest<WorkingTreeReview>(`/api/projects/${encodeURIComponent(projectId)}/changes/review`)
}

export function backupWorkingTreeChanges(projectId: string, snapshotIds: string[], options: { restore?: boolean } = {}) {
  return postJson<WorkingTreeBackupResult>(`/api/projects/${encodeURIComponent(projectId)}/changes/backup`, { snapshotIds, ...options })
}

export function clearSnapshotReviewChanges(projectId: string, snapshotIds?: string[]) {
  return postJson<SnapshotReviewClearResult>(`/api/projects/${encodeURIComponent(projectId)}/changes/review/clear`, { snapshotIds })
}

export function uploadInstructionFiles(projectId: string, files: File[]) {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  return apiRequest<{ paths: string[] }>(`/api/projects/${encodeURIComponent(projectId)}/config/instructions/upload-files`, {
    method: 'POST',
    body: formData,
  })
}

export function searchProjectPaths(projectId: string, query: string, limit = 30) {
  const params = new URLSearchParams({ q: query, limit: String(limit) })
  return apiRequest<ProjectPathReference[]>(`/api/projects/${encodeURIComponent(projectId)}/config/paths?${params.toString()}`)
}

export function createAgent(projectId: string, body: {
  name: string
  description?: string
  mode?: string
  model?: string
  temperature?: number
  maxSteps?: number
  disable?: boolean
  tools?: Record<string, unknown>
  permission?: Record<string, unknown>
  taskPermission?: Record<string, unknown>
  topP?: number
  prompt?: string
}) {
  return postJson<ConfigChange>(`/api/projects/${encodeURIComponent(projectId)}/agents`, body)
}

export function getAgent(projectId: string, agentName: string) {
  return apiRequest<AgentDetail>(`/api/projects/${encodeURIComponent(projectId)}/agents/${encodeURIComponent(agentName)}`)
}

export function updateAgent(projectId: string, agentName: string, body: {
  description?: string
  mode?: string
  model?: string
  temperature?: number
  maxSteps?: number
  disable?: boolean
  tools?: Record<string, unknown>
  permission?: Record<string, unknown>
  taskPermission?: Record<string, unknown>
  topP?: number
  prompt?: string
}) {
  return patchJson<ConfigChange>(`/api/projects/${encodeURIComponent(projectId)}/agents/${encodeURIComponent(agentName)}`, body)
}

export async function removeAgent(projectId: string, agentName: string) {
  const response = await fetch(`${apiBaseUrl}/api/projects/${encodeURIComponent(projectId)}/agents/${encodeURIComponent(agentName)}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (response.status === 204) return
  const payload = await response.json().catch(() => null) as ApiResponse<unknown> | null
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error?.message ?? payload?.message ?? `API request failed: ${response.status}`)
  }
}

export function previewPermissionUpdate(projectId: string, permission: Record<string, unknown>) {
  return patchJson<ConfigChange>(`/api/projects/${encodeURIComponent(projectId)}/permissions`, { permission })
}

export function importSkill(projectId: string, body: { directoryName: string; content: string }) {
  return postJson<ConfigChange>(`/api/projects/${encodeURIComponent(projectId)}/skills/import`, body)
}

export function findExternalSkills(skillName: string) {
  return postJson<ExternalSkillFindResult>('/api/skills/find', { skillName })
}

export function installGlobalSkill(packageId: string) {
  return postJson<GlobalSkillInstallResult>('/api/skills/install-global', { packageId })
}

export function getSkillDetail(projectId: string, skillName: string) {
  return apiRequest<SkillDetail>(`/api/projects/${encodeURIComponent(projectId)}/skills/${encodeURIComponent(skillName)}`)
}

export async function removeSkill(projectId: string, skillName: string) {
  const response = await fetch(`${apiBaseUrl}/api/projects/${encodeURIComponent(projectId)}/skills/${encodeURIComponent(skillName)}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (response.status === 204) return
  const payload = await response.json().catch(() => null) as ApiResponse<unknown> | null
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error?.message ?? payload?.message ?? `API request failed: ${response.status}`)
  }
}

export function installMarketplaceSkill(projectId: string, marketplaceSkillId: string, directoryName: string) {
  return postJson<ConfigChange>(`/api/projects/${encodeURIComponent(projectId)}/skills/install`, {
    marketplaceSkillId,
    directoryName,
    scope: 'project',
  })
}

export function createMcpServer(projectId: string, body: Record<string, unknown>) {
  return postJson<ConfigChange>(`/api/projects/${encodeURIComponent(projectId)}/mcp-servers`, body)
}

export function listMcpMarketplace(query: { q?: string; limit?: number } = {}) {
  const params = new URLSearchParams()
  if (query.q?.trim()) params.set('q', query.q.trim())
  if (query.limit) params.set('limit', String(query.limit))
  const suffix = params.toString() ? `?${params.toString()}` : ''
  return apiRequest<McpMarketplaceItem[]>(`/api/mcp-marketplace${suffix}`)
}

export function installMcpServer(projectId: string, body: {
  marketplaceId: string
  name: string
  url: string
  apiKey?: string
  apiKeyEnvVar?: string
}) {
  return postJson<McpInstallResult>(`/api/projects/${encodeURIComponent(projectId)}/mcp-servers/install`, body)
}

export function checkMcpServers(projectId: string) {
  return postJson<McpRuntimeCheck>(`/api/projects/${encodeURIComponent(projectId)}/mcp-servers/check`, {})
}

export async function removeMcpServer(projectId: string, name: string) {
  const response = await fetch(`${apiBaseUrl}/api/projects/${encodeURIComponent(projectId)}/mcp-servers/${encodeURIComponent(name)}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  const payload = await response.json().catch(() => null) as ApiResponse<unknown> | null
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error?.message ?? payload?.message ?? `API request failed: ${response.status}`)
  }
}

export function createCommand(projectId: string, body: { name: string; description?: string; agent?: string; model?: string; template: string }) {
  return postJson<CommandItem>(`/api/projects/${encodeURIComponent(projectId)}/commands`, body)
}

export function getCommand(projectId: string, name: string) {
  return apiRequest<CommandItem>(`/api/projects/${encodeURIComponent(projectId)}/commands/${encodeURIComponent(name)}`)
}

export async function removeCommand(projectId: string, name: string) {
  const response = await fetch(`${apiBaseUrl}/api/projects/${encodeURIComponent(projectId)}/commands/${encodeURIComponent(name)}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (response.status === 204) return
  const payload = await response.json().catch(() => null) as ApiResponse<unknown> | null
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error?.message ?? payload?.message ?? `API request failed: ${response.status}`)
  }
}
