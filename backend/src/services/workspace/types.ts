export type Risk = 'low' | 'medium' | 'high' | 'critical';
export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export type Metric = {
  title: string;
  value: string;
  detail: string;
  tone: StatusTone;
};

export type AuditItem = {
  action: string;
  target: string;
  risk: Risk;
  status: string;
  time: string;
};

export type PermissionRow = {
  tool: string;
  project: string;
  global: string;
  effective: string;
  risk: Risk;
};

export type ConfigFile = {
  name: string;
  path: string;
  type: 'file' | 'directory';
  valid: boolean | null;
};

export type AgentItem = {
  name: string;
  mode: string;
  model: string;
  permissions: string;
  risk: Risk;
  description: string;
  sourcePath: string;
  builtIn: boolean;
};

export type SkillItem = {
  name: string;
  scope: string;
  source: string;
  status: string;
  risk: Risk;
  description: string;
};

export type MarketplaceItem = {
  id: string;
  name: string;
  source: string;
  license: string;
  risk: Risk;
  description: string;
};

export type McpServer = {
  name: string;
  transport: string;
  status: StatusTone;
  latency: string;
  risk: Risk;
  scope: 'global' | 'project';
  enabled: boolean;
  url?: string;
};

export type CommandItem = {
  name: string;
  description: string;
  sourcePath: string;
  preview: string;
  source: string;
  builtIn: boolean;
  agent?: string;
  model?: string;
};

export type ProviderItem = {
  id: string;
  name: string;
  source: string;
};

export type RiskQueueItem = {
  title: string;
  detail: string;
  risk: Risk;
};

export type WorkspaceConfigSnapshot = {
  files: ConfigFile[];
  previewPath: string | null;
  preview: string;
  parsedConfig: Record<string, unknown> | null;
  configPath: string | null;
  tuiConfigPath: string | null;
};

export type WorkspaceProjectSnapshot = {
  id: string;
  name: string;
  rootPath: string;
};

export type OpenCodeServerSnapshot = {
  value: string;
  detail: string;
  tone: StatusTone;
};

export type PackageJsonSnapshot = {
  name?: unknown;
  version?: unknown;
} | null;

export type AppState = {
  generatedAt: string;
  project: {
    id: string;
    name: string;
    rootPath: string;
    configPath: string | null;
    tuiConfigPath: string | null;
    platform: string;
    packageName: string | null;
    packageVersion: string | null;
  };
  navBadges: {
    permissions: number;
    audit: number;
  };
  quickActions: string[];
  dashboard: {
    metrics: Metric[];
    projectStatus: Array<{ label: string; value: string }>;
    riskQueue: RiskQueueItem[];
    recentAudit: AuditItem[];
  };
  config: {
    files: ConfigFile[];
    previewPath: string | null;
    preview: string;
    effective: Record<string, unknown> | null;
  };
  agents: AgentItem[];
  permissions: PermissionRow[];
  skills: SkillItem[];
  marketplace: MarketplaceItem[];
  mcpServers: McpServer[];
  commands: CommandItem[];
  models: string[];
  providers: ProviderItem[];
  audit: AuditItem[];
  settings: Array<{ title: string; value: string }>;
};
