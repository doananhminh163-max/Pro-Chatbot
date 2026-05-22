export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ChangeStatus = 'draft' | 'previewed' | 'applied' | 'failed' | 'cancelled' | 'rolled_back';
export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export type ProjectRecord = {
  id: string;
  name: string;
  rootPath: string;
  configPath: string | null;
  tuiConfigPath: string | null;
  platform: string;
  createdAt: string;
  updatedAt: string;
};

export type ServerConnectionRecord = {
  id: string;
  projectId: string;
  baseUrl: string;
  authMode: 'none' | 'basic' | 'token';
  username?: string;
  passwordRef?: string;
  isDefault: boolean;
  status: string;
  lastCheckedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ConfigChangeRecord = {
  id: string;
  projectId: string;
  type: string;
  summary: string;
  targetFile: string | null;
  diff: string;
  riskLevel: RiskLevel;
  status: ChangeStatus;
  warnings: Array<{ code: string; message: string }>;
  createdAt: string;
  appliedAt?: string;
  beforeContent?: string;
  afterContent?: string;
};

export type ConfigBackupRecord = {
  id: string;
  projectId: string;
  configChangeId?: string;
  filePath: string;
  backupPath: string;
  createdAt: string;
};

export type MarketplaceSkillRecord = {
  id: string;
  name: string;
  description: string;
  sourceUrl: string;
  trustLevel: 'unknown' | 'community' | 'verified' | 'official' | 'blocked';
  cachedAt: string;
  content?: string;
};

export type AuditLogRecord = {
  id: string;
  configChangeId?: string;
  actor: string;
  action: string;
  targetType: string;
  targetId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type AppStateStore = {
  version: 1;
  projects: ProjectRecord[];
  serverConnections: ServerConnectionRecord[];
  configChanges: ConfigChangeRecord[];
  backups: ConfigBackupRecord[];
  marketplaceSkills: MarketplaceSkillRecord[];
  skillOverrides: Record<string, { status?: string }>;
  snapshotReviewDismissals: Record<string, string[]>;
  auditLogs: AuditLogRecord[];
};

export type ConfigFileInfo = {
  path: string;
  kind: 'opencode' | 'tui' | 'directory';
  exists: boolean;
  valid: boolean | null;
  content: unknown;
};

export type FrontMatter = Record<string, unknown>;
