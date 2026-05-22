export type Risk = 'low' | 'medium' | 'high' | 'critical'
export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export type AppMetric = {
  title: string
  value: string
  detail: string
  tone: StatusTone
}

export type AuditItem = {
  action: string
  target: string
  risk: Risk
  status: string
  time: string
}

export type RiskQueueItem = {
  title: string
  detail: string
  risk: Risk
}

export type ProjectInfo = {
  id: string
  name: string
  rootPath: string
  configPath: string | null
  tuiConfigPath: string | null
  platform: string
  packageName: string | null
  packageVersion: string | null
}

export type ConfigFile = {
  name: string
  path: string
  type: 'file' | 'directory'
  valid: boolean | null
}

export type AgentItem = {
  name: string
  mode: string
  model: string
  permissions: string
  risk: Risk
  description: string
  sourcePath: string
  builtIn: boolean
}

export type AgentDetail = {
  name: string
  mode?: string
  description?: string
  source?: string
  filePath?: string | null
  builtIn?: boolean
  enabled?: boolean
  disable?: boolean
  model?: string
  tools?: unknown
  permission?: unknown
  taskPermission?: unknown
  temperature?: number
  maxSteps?: number
  topP?: number
  prompt?: string
}

export type PermissionItem = {
  tool: string
  project: string
  global: string
  effective: string
  risk: Risk
}

export type SkillItem = {
  name: string
  scope: string
  source: string
  status: string
  risk: Risk
  description: string
}

export type SkillDetail = {
  name: string
  frontmatter: Record<string, string>
  bodyPreview: string
  validation: {
    valid: boolean
    errors: Array<{ code: string; message: string }>
    warnings: Array<{ code: string; message: string }>
  }
  sourcePath: string
}

export type ExternalSkillFindResult = {
  query: string
  command: string
  stdout: string
  stderr: string
  items: Array<{
    package: string
    name: string
    installs: string
    url: string
  }>
}

export type GlobalSkillInstallResult = {
  packageId: string
  command: string
  stdout: string
  stderr: string
}

export type MarketplaceItem = {
  id?: string
  name: string
  source: string
  license: string
  risk: Risk
  description: string
}

export type McpServer = {
  name: string
  transport: string
  status: StatusTone
  latency: string
  risk: Risk
  scope: 'global' | 'project'
  enabled: boolean
  url?: string
}

export type McpMarketplaceItem = {
  id: string
  name: string
  description: string
  url: string
  packageIdentifier?: string
  registryType?: string
  installName?: string
  source?: string
  transport?: string
  installable?: boolean
  apiKeyEnvVar: string
  apiKeyHeader: string
  risk: Risk
}

export type McpInstallResult = {
  change: ConfigChange
  applyResult: {
    configChangeId: string
    status: string
  }
  server: {
    name: string
    config: Record<string, unknown>
  }
  runtimeStatus: Record<string, unknown> | null
  runtimeError: string | null
}

export type McpRuntimeCheck = {
  health: {
    status: string
    baseUrl: string
    version: string
  }
  status: Record<string, unknown>
}

export type ProviderItem = {
  id: string
  name: string
  source: string
}

export type CommandItem = {
  name: string
  description: string
  sourcePath: string
  preview: string
  source: string
  builtIn: boolean
  agent?: string
  model?: string
  frontmatter?: Record<string, string>
  template?: string
}

export type SessionItem = {
  id: string
  title: string
  status: string
  model: string
  openCodeSessionId?: string
  messageCount?: number
  lastMessageAt?: string
  lastMessagePreview?: string
}

export type SettingItem = {
  title: string
  value: string
}

export type ConfigChange = {
  id: string
  projectId: string
  type: string
  summary: string
  targetFile: string | null
  diff: string
  riskLevel: Risk
  status: string
  warnings: Array<{ code: string; message: string }>
  createdAt: string
  appliedAt?: string
}

export type ConfigIntent = {
  intent: string
  confidence: number
  missingFields: string[]
  configChangeId?: string
  proposal: Record<string, unknown>
  diff?: string
}

export type WorkingTreeChangeFile = {
  id?: string
  path: string
  oldPath?: string
  status: string
  statusCode: string
  riskLevel: Risk
  backupEligible: boolean
  diff: string
  warnings: Array<{ code: string; message: string }>
  sessionId?: string
  sessionTitle?: string
  messageId?: string
  messageCreatedAt?: string
  additions?: number
  deletions?: number
}

export type WorkingTreeReview = {
  projectId: string
  generatedAt: string
  source?: 'opencode_snapshot'
  files: WorkingTreeChangeFile[]
  summary: {
    total: number
    modified: number
    deleted: number
    added?: number
    untracked: number
    highRisk: number
  }
}

export type WorkingTreeBackupResult = {
  backupRoot: string
  createdAt: string
  backups: Array<{
    id: string
    snapshotId?: string
    filePath: string
    status: string
    riskLevel: Risk
    sessionId?: string
    messageId?: string
    additions?: number
    deletions?: number
    currentBackupPath: string
    headBackupPath: string
    patchBackupPath?: string
  }>
}

export type SnapshotReviewClearResult = {
  projectId: string
  cleared: number
  snapshotIds: string[]
  cleanup: {
    deletedPaths: string[]
    missingPaths: string[]
    failedPaths: Array<{ path: string; message: string }>
  }
  generatedAt: string
}

export type ChatSession = {
  id: string
  projectId: string
  openCodeSessionId?: string
  title: string
  agent?: string
  model?: string
  skills: string[]
  mcps: string[]
  status: string
  createdAt: string
  updatedAt: string
  messageCount?: number
  lastMessageAt?: string
  lastMessagePreview?: string
}

export type ChatMessage = {
  id: string
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  parts?: ChatMessagePart[]
  createdAt: string
  streaming?: boolean
}

export type ChatMessagePart = {
  type?: string
  text?: string
  [key: string]: unknown
}

export type PermissionResponse = 'once' | 'always' | 'reject'

export type ChatToolActivity = {
  id: string
  callId: string
  tool: string
  title: string
  status: 'pending' | 'running' | 'success' | 'error'
  input?: Record<string, unknown>
  detail?: string
  timestamp?: number
}

export type ChatPermissionPrompt = {
  id: string
  sessionId: string
  permission: string
  title: string
  detail: string
  patterns: string[]
  metadata: Record<string, unknown>
  tool?: {
    messageId?: string
    callId?: string
  }
  always: string[]
  status: 'pending' | 'answered' | 'responding'
  response?: PermissionResponse
}

export type ChatFileReference = {
  path: string
  name?: string
  mime?: string
}

export type ProjectPathReference = {
  path: string
  name: string
  type: 'file' | 'directory'
}

export type ChatSubmitOptions = {
  agent?: string
  model?: string
  command?: string
  arguments?: string
  skills?: string[]
  files?: ChatFileReference[]
}

export type ChatTurnBackup = {
  backupRoot: string
  createdAt: string
  sessionId: string
  messageId: string
  files: Array<{
    id: string
    filePath: string
    status: string
    additions: number
    deletions: number
    currentBackupPath: string
    headBackupPath: string
    patchBackupPath: string
  }>
}

export type ChatTurnBackupFailure = {
  code?: string
  message: string
}

export type ChatResponse = {
  sessionId: string
  openCodeSessionId?: string
  userMessage: ChatMessage
  assistantMessage: ChatMessage
  info: ChatMessage
  parts: ChatMessagePart[]
  configChangeId?: string
  proposal?: Record<string, unknown>
  backup?: ChatTurnBackup
  backupError?: ChatTurnBackupFailure
}

export type ChatStreamEvent =
  | { type: 'user'; message: ChatMessage }
  | { type: 'assistant_start'; message: ChatMessage }
  | { type: 'thinking_delta'; delta: string }
  | { type: 'text_delta'; delta: string }
  | { type: 'tool_activity'; activity: ChatToolActivity }
  | { type: 'permission_prompt'; prompt: ChatPermissionPrompt }
  | { type: 'permission_resolved'; permissionId: string; response: PermissionResponse }
  | { type: 'done'; response: ChatResponse }
  | { type: 'error'; error?: { message?: string } }

export type ChatSessionDetail = {
  session: ChatSession
  messages: ChatMessage[]
}

export type ChatSessionExport = ChatSessionDetail & {
  exportedAt: string
}

export type AppState = {
  generatedAt: string
  project: ProjectInfo
  navBadges: {
    permissions: number
    audit: number
  }
  quickActions: string[]
  dashboard: {
    metrics: AppMetric[]
    projectStatus: Array<{ label: string; value: string }>
    riskQueue: RiskQueueItem[]
    recentAudit: AuditItem[]
  }
  config: {
    files: ConfigFile[]
    previewPath: string | null
    preview: string
    effective: Record<string, unknown> | null
  }
  agents: AgentItem[]
  permissions: PermissionItem[]
  skills: SkillItem[]
  marketplace: MarketplaceItem[]
  mcpServers: McpServer[]
  commands: CommandItem[]
  models: string[]
  providers: ProviderItem[]
  sessions: SessionItem[]
  audit: AuditItem[]
  settings: SettingItem[]
}
