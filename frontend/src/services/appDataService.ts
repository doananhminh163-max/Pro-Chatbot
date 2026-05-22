import type { AgentDetail, AppState, ChatFileReference, ChatResponse, ChatSession, ChatSessionDetail, ChatSessionExport, ChatStreamEvent, ChatSubmitOptions, CommandItem, ConfigChange, ConfigIntent, ExternalSkillFindResult, GlobalSkillInstallResult, McpInstallResult, McpMarketplaceItem, McpRuntimeCheck, PermissionResponse, ProjectPathReference, SkillDetail, SnapshotReviewClearResult, WorkingTreeBackupResult, WorkingTreeReview } from '../types/appData'

type ApiResponse<T> = {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: unknown
  }
}

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

  const payload = await response.json() as ApiResponse<T>
  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new Error(payload.error?.message ?? payload.message ?? `API request failed: ${response.status}`)
  }

  return payload.data
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

function deleteJson<T>(path: string) {
  return apiRequest<T>(path, {
    method: 'DELETE',
  })
}

function parseStreamEvent(block: string): ChatStreamEvent | null {
  const data = block
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())
    .join('\n')
    .trim()

  if (!data || data === '[DONE]') return null
  return JSON.parse(data) as ChatStreamEvent
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === 'AbortError'
}

async function readChatStream(response: Response, onEvent?: (event: ChatStreamEvent) => void, signal?: AbortSignal) {
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('Streaming is not supported by this browser.')
  }

  const decoder = new TextDecoder()
  let buffer = ''
  let finalResponse: ChatResponse | null = null

  try {
    while (true) {
      const { done, value } = await reader.read()
      buffer += decoder.decode(value, { stream: !done }).replace(/\r\n/g, '\n')

      let separatorIndex = buffer.indexOf('\n\n')
      while (separatorIndex !== -1) {
        const event = parseStreamEvent(buffer.slice(0, separatorIndex))
        buffer = buffer.slice(separatorIndex + 2)
        if (event) {
          if (event.type === 'error') {
            throw new Error(event.error?.message ?? 'OpenCode chat stream failed')
          }
          onEvent?.(event)
          if (event.type === 'done') {
            finalResponse = event.response
          }
        }
        separatorIndex = buffer.indexOf('\n\n')
      }

      if (done) {
        const event = parseStreamEvent(buffer)
        if (event) {
          if (event.type === 'error') {
            throw new Error(event.error?.message ?? 'OpenCode chat stream failed')
          }
          onEvent?.(event)
          if (event.type === 'done') {
            finalResponse = event.response
          }
        }
        break
      }
    }
  } finally {
    reader.releaseLock()
  }

  if (!finalResponse) {
    if (signal?.aborted) {
      throw new DOMException('Chat stream aborted', 'AbortError')
    }
    throw new Error('OpenCode chat stream closed before completion.')
  }
  return finalResponse
}

export function createConfigIntent(message: string, projectId: string) {
  return postJson<ConfigIntent>('/api/chat/config-intents', { projectId, message })
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

export function backupWorkingTreeChanges(projectId: string, snapshotIds: string[]) {
  return postJson<WorkingTreeBackupResult>(`/api/projects/${encodeURIComponent(projectId)}/changes/backup`, { snapshotIds })
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

export function createChatSession(projectId: string, body: { title: string; agent?: string; model?: string; skills?: string[]; mcps?: string[] }) {
  return postJson<ChatSession>(`/api/projects/${encodeURIComponent(projectId)}/chat/sessions`, body)
}

export function listChatSessions(projectId: string, status = 'all') {
  return apiRequest<ChatSession[]>(`/api/projects/${encodeURIComponent(projectId)}/chat/sessions?status=${encodeURIComponent(status)}`)
}

export function getChatSession(projectId: string, sessionId: string) {
  return apiRequest<ChatSessionDetail>(`/api/projects/${encodeURIComponent(projectId)}/chat/sessions/${encodeURIComponent(sessionId)}`)
}

export function updateChatSession(projectId: string, sessionId: string, body: Partial<Pick<ChatSession, 'title' | 'status' | 'agent' | 'model' | 'skills' | 'mcps'>>) {
  return patchJson<ChatSession>(`/api/projects/${encodeURIComponent(projectId)}/chat/sessions/${encodeURIComponent(sessionId)}`, body)
}

export function deleteChatSession(projectId: string, sessionId: string) {
  return deleteJson<{ deleted: boolean; id: string }>(`/api/projects/${encodeURIComponent(projectId)}/chat/sessions/${encodeURIComponent(sessionId)}`)
}

export function exportChatSession(projectId: string, sessionId: string) {
  return apiRequest<ChatSessionExport>(`/api/projects/${encodeURIComponent(projectId)}/chat/sessions/${encodeURIComponent(sessionId)}/export`)
}

export function searchChatFiles(projectId: string, query: string) {
  const params = new URLSearchParams({ q: query })
  return apiRequest<ChatFileReference[]>(`/api/projects/${encodeURIComponent(projectId)}/chat/files?${params.toString()}`)
}

export function sendChatMessage(projectId: string, sessionId: string, message: string, options: ChatSubmitOptions = {}) {
  return postJson<ChatResponse>(`/api/projects/${encodeURIComponent(projectId)}/chat/sessions/${encodeURIComponent(sessionId)}/messages`, {
    message,
    ...options,
  })
}

export function respondChatPermission(projectId: string, sessionId: string, permissionId: string, response: PermissionResponse) {
  return postJson<{ permissionId: string; response: PermissionResponse; accepted: boolean }>(
    `/api/projects/${encodeURIComponent(projectId)}/chat/sessions/${encodeURIComponent(sessionId)}/permissions/${encodeURIComponent(permissionId)}`,
    { response },
  )
}

export async function streamChatMessage(projectId: string, sessionId: string, message: string, options: ChatSubmitOptions = {}, onEvent?: (event: ChatStreamEvent) => void, signal?: AbortSignal) {
  const response = await fetch(`${apiBaseUrl}/api/projects/${encodeURIComponent(projectId)}/chat/sessions/${encodeURIComponent(sessionId)}/messages/stream`, {
    method: 'POST',
    credentials: 'include',
    signal,
    headers: {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, ...options }),
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as ApiResponse<unknown> | null
    throw new Error(payload?.error?.message ?? payload?.message ?? `API request failed: ${response.status}`)
  }

  try {
    return await readChatStream(response, onEvent, signal)
  } catch (error) {
    if (signal?.aborted && isAbortError(error)) {
      throw error
    }
    throw error
  }
}
