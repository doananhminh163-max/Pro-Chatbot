import crypto from 'node:crypto';
import path from 'node:path';
import type {
  AgentItem,
  AppState,
  AuditItem,
  CommandItem,
  ConfigFile,
  McpServer,
  OpenCodeServerSnapshot,
  PackageJsonSnapshot,
  PermissionRow,
  ProviderItem,
  RiskQueueItem,
  SkillItem,
  StatusTone,
  WorkspaceConfigSnapshot,
  WorkspaceProjectSnapshot,
} from './types.js';

export type WorkspacePresentationInput = {
  agents: AgentItem[];
  audit: AuditItem[];
  backupsCount: number;
  backupsPath: string;
  commands: CommandItem[];
  config: WorkspaceConfigSnapshot;
  defaultOpenCodeBaseUrl: string;
  generatedAt: string;
  localeTimestamp: string;
  mcpServers: McpServer[];
  models: string[];
  openCodeConfig: Record<string, unknown> | null;
  openCodeProject: WorkspaceProjectSnapshot;
  openCodeServer: OpenCodeServerSnapshot;
  packageJson: PackageJsonSnapshot;
  permissions: PermissionRow[];
  platform: string;
  providers: ProviderItem[];
  quickActions: string[];
  riskQueue: RiskQueueItem[];
  root: string;
  skills: SkillItem[];
};

function buildConfigHealth(files: ConfigFile[]) {
  const invalidConfig = files.find((file) => file.valid === false);
  const validConfigCount = files.filter((file) => file.valid === true).length;

  if (invalidConfig) {
    return { value: 'Invalid', detail: invalidConfig.name, tone: 'danger' as StatusTone };
  }

  if (validConfigCount > 0) {
    return { value: 'Valid', detail: `${validConfigCount} config file(s) parsed`, tone: 'success' as StatusTone };
  }

  return { value: 'Missing', detail: 'No OpenCode config found', tone: 'warning' as StatusTone };
}

function buildMarketplace(skills: SkillItem[]) {
  return skills
    .filter((skill) => skill.scope === 'global')
    .slice(0, 30)
    .map((skill) => ({
      id: `mkt_${crypto.createHash('sha1').update(path.join(skill.source, 'SKILL.md')).digest('hex').slice(0, 10)}`,
      name: skill.name,
      source: skill.source,
      license: 'declared in source',
      risk: skill.risk,
      description: skill.description,
    }));
}

export function buildWorkspaceAppState(input: WorkspacePresentationInput): AppState {
  const configHealth = buildConfigHealth(input.config.files);

  return {
    generatedAt: input.generatedAt,
    project: {
      id: input.openCodeProject.id,
      name: input.openCodeProject.name,
      rootPath: input.openCodeProject.rootPath,
      configPath: input.config.configPath,
      tuiConfigPath: input.config.tuiConfigPath,
      platform: input.platform,
      packageName: typeof input.packageJson?.name === 'string' ? input.packageJson.name : null,
      packageVersion: typeof input.packageJson?.version === 'string' ? input.packageJson.version : null,
    },
    navBadges: {
      permissions: input.permissions.filter((permission) => permission.risk === 'high' || permission.risk === 'critical').length,
      audit: input.audit.length,
    },
    quickActions: input.quickActions,
    dashboard: {
      metrics: [
        {
          title: 'OpenCode server',
          value: input.openCodeServer.value,
          detail: input.openCodeServer.detail,
          tone: input.openCodeServer.tone,
        },
        {
          title: 'Config health',
          value: configHealth.value,
          detail: configHealth.detail,
          tone: configHealth.tone,
        },
        {
          title: 'Risk queue',
          value: `${input.riskQueue.length} item(s)`,
          detail: input.riskQueue.length ? 'Derived from config, MCP and git status' : 'No active risk items',
          tone: input.riskQueue.length ? 'warning' : 'success',
        },
        {
          title: 'Backups',
          value: `${input.backupsCount} snapshot(s)`,
          detail: input.backupsPath,
          tone: input.backupsCount > 0 ? 'info' : 'neutral',
        },
      ],
      projectStatus: [
        { label: 'Root path', value: input.root },
        { label: 'Config path', value: input.config.configPath ?? 'not found' },
        { label: 'Platform', value: input.platform.replace(' ', ' · ') },
        { label: 'Package', value: input.packageJson?.name ? `${input.packageJson.name}@${input.packageJson.version ?? 'unknown'}` : 'not found' },
      ],
      riskQueue: input.riskQueue,
      recentAudit: input.audit.slice(0, 8),
    },
    config: {
      files: input.config.files,
      previewPath: input.config.previewPath,
      preview: input.config.preview,
      effective: (input.config.parsedConfig ?? input.openCodeConfig) as Record<string, unknown> | null,
    },
    agents: input.agents,
    permissions: input.permissions,
    skills: input.skills,
    marketplace: buildMarketplace(input.skills),
    mcpServers: input.mcpServers,
    commands: input.commands,
    models: input.models,
    providers: input.providers,
    audit: input.audit,
    settings: [
      { title: 'Backend port', value: process.env.PORT ?? 'not configured' },
      { title: 'Node environment', value: process.env.NODE_ENV ?? 'not configured' },
      { title: 'OpenCode server URL', value: input.defaultOpenCodeBaseUrl },
      { title: 'Workspace root', value: input.root },
      { title: 'Data generated at', value: input.localeTimestamp },
    ],
  };
}
