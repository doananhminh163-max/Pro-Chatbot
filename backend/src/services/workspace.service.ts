import { execFile } from 'node:child_process';
import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { parseFrontMatter } from './opencode-control/frontmatter.js';
import { ensureOpenCodeServer, getDefaultOpenCodeBaseUrl, openCodeJson } from './opencode-control/runtime.js';

const execFileAsync = promisify(execFile);

type Risk = 'low' | 'medium' | 'high' | 'critical';
type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

type Metric = {
  title: string;
  value: string;
  detail: string;
  tone: StatusTone;
};

type AuditItem = {
  action: string;
  target: string;
  risk: Risk;
  status: string;
  time: string;
};

type PermissionRow = {
  tool: string;
  project: string;
  global: string;
  effective: string;
  risk: Risk;
};

type ConfigFile = {
  name: string;
  path: string;
  type: 'file' | 'directory';
  valid: boolean | null;
};

type AgentItem = {
  name: string;
  mode: string;
  model: string;
  permissions: string;
  risk: Risk;
  description: string;
  sourcePath: string;
  builtIn: boolean;
};

type SkillItem = {
  name: string;
  scope: string;
  source: string;
  status: string;
  risk: Risk;
  description: string;
};

type MarketplaceItem = {
  id: string;
  name: string;
  source: string;
  license: string;
  risk: Risk;
  description: string;
};

type McpServer = {
  name: string;
  transport: string;
  status: StatusTone;
  latency: string;
  risk: Risk;
  scope: 'global' | 'project';
  enabled: boolean;
  url?: string;
};

type CommandItem = {
  name: string;
  description: string;
  sourcePath: string;
  preview: string;
  source: string;
  builtIn: boolean;
  agent?: string;
  model?: string;
};

type ProviderItem = {
  id: string;
  name: string;
  source: string;
};

type SessionItem = {
  id: string;
  title: string;
  status: string;
  model: string;
  openCodeSessionId?: string;
  messageCount?: number;
  lastMessageAt?: string;
  lastMessagePreview?: string;
};

type RiskQueueItem = {
  title: string;
  detail: string;
  risk: Risk;
};

type AppState = {
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
  sessions: SessionItem[];
  audit: AuditItem[];
  settings: Array<{ title: string; value: string }>;
};

const TEXT_EXTENSIONS = new Set(['.json', '.jsonc', '.md', '.txt', '.toml', '.yaml', '.yml']);

function resolveWorkspaceRoot() {
  if (process.env.PROJECT_ROOT) {
    return path.resolve(process.env.PROJECT_ROOT);
  }

  const current = process.cwd();
  if (path.basename(current).toLowerCase() === 'backend') {
    return path.dirname(current);
  }

  return current;
}

function stableProjectId(root: string) {
  return `prj_${crypto.createHash('sha1').update(root.toLowerCase()).digest('hex').slice(0, 10)}`;
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readText(targetPath: string, maxLength = 12000) {
  const text = await fs.readFile(targetPath, 'utf8');
  return text.length > maxLength ? `${text.slice(0, maxLength)}\n...` : text;
}

async function readJson(targetPath: string) {
  const text = await fs.readFile(targetPath, 'utf8');
  return JSON.parse(stripJsonComments(text));
}

function stripJsonComments(input: string) {
  let output = '';
  let inString = false;
  let quote = '';
  let escaped = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (inString) {
      output += char;
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      quote = char;
      output += char;
      continue;
    }

    if (char === '/' && next === '/') {
      while (index < input.length && input[index] !== '\n') {
        index += 1;
      }
      output += '\n';
      continue;
    }

    if (char === '/' && next === '*') {
      index += 2;
      while (index < input.length && !(input[index] === '*' && input[index + 1] === '/')) {
        index += 1;
      }
      index += 1;
      continue;
    }

    output += char;
  }

  return output.replace(/,\s*([}\]])/g, '$1');
}

function firstMarkdownParagraph(markdown: string) {
  return markdown
    .replace(/^\uFEFF/, '')
    .replace(/^---[\s\S]*?\n---/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#'))
    ?.slice(0, 180) ?? '';
}

async function runGit(root: string, args: string[]) {
  try {
    const { stdout } = await execFileAsync('git', ['-C', root, ...args], { timeout: 5000 });
    return stdout.trimEnd();
  } catch {
    return '';
  }
}

function riskFromTarget(target: string): Risk {
  const normalized = target.replace(/\\/g, '/').toLowerCase();
  if (normalized.includes('package-lock')) {
    return 'high';
  }
  if (normalized.includes('permission') || normalized.includes('mcp') || normalized.includes('.env')) {
    return 'critical';
  }
  if (normalized.includes('backend') || normalized.includes('frontend/src')) {
    return 'medium';
  }
  return 'low';
}

function riskFromPermission(tool: string, value: string): Risk {
  const normalized = `${tool}:${value}`.toLowerCase();
  if (normalized.includes('*') || normalized.includes('allow') && /(bash|shell|exec|mcp|remote)/.test(normalized)) {
    return 'critical';
  }
  if (/(bash|edit|write|delete|mcp|remote)/.test(normalized)) {
    return 'high';
  }
  if (normalized.includes('ask')) {
    return 'medium';
  }
  return 'low';
}

function statusLabel(code: string) {
  if (code.includes('??')) return 'untracked';
  if (code.includes('M')) return 'modified';
  if (code.includes('A')) return 'added';
  if (code.includes('D')) return 'deleted';
  if (code.includes('R')) return 'renamed';
  return 'changed';
}

async function collectPackage(root: string) {
  const packagePath = path.join(root, 'package.json');
  if (!(await pathExists(packagePath))) {
    return null;
  }
  return readJson(packagePath).catch(() => null);
}

async function collectConfig(root: string) {
  const candidates = [
    path.join(root, 'opencode.json'),
    path.join(root, 'opencode.jsonc'),
    path.join(root, 'tui.json'),
  ];

  const files: ConfigFile[] = [];
  let parsedConfig: Record<string, unknown> | null = null;
  let previewPath: string | null = null;
  let preview = '';

  for (const candidate of candidates) {
    if (!(await pathExists(candidate))) continue;

    let valid: boolean | null = null;
    if (TEXT_EXTENSIONS.has(path.extname(candidate))) {
      valid = await readJson(candidate).then((value) => {
        if (!parsedConfig && path.basename(candidate).startsWith('opencode')) {
          parsedConfig = value as Record<string, unknown>;
        }
        return true;
      }).catch(() => false);
    }

    if (!previewPath) {
      previewPath = candidate;
      preview = await readText(candidate);
    }

    files.push({
      name: path.basename(candidate),
      path: candidate,
      type: 'file',
      valid,
    });
  }

  const opencodeDir = path.join(root, '.opencode');
  if (await pathExists(opencodeDir)) {
    const entries = await fs.readdir(opencodeDir, { withFileTypes: true });
    for (const entry of entries) {
      files.push({
        name: `.opencode/${entry.name}`,
        path: path.join(opencodeDir, entry.name),
        type: entry.isDirectory() ? 'directory' : 'file',
        valid: null,
      });
    }
  }

  if (!preview) {
    preview = 'Không tìm thấy opencode.json, opencode.jsonc hoặc tui.json trong workspace hiện tại.';
  }

  return {
    files,
    parsedConfig,
    previewPath,
    preview,
    configPath: candidates.find((candidate) => files.some((file) => file.path === candidate && file.name.startsWith('opencode'))) ?? null,
    tuiConfigPath: files.find((file) => file.name === 'tui.json')?.path ?? null,
  };
}

async function collectGit(root: string) {
  const statusOutput = await runGit(root, ['status', '--porcelain=v1']);
  const statusItems = statusOutput
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const code = line.slice(0, 2).trim() || line.slice(0, 2);
      const target = line.slice(3).trim();
      return {
        code,
        target,
        risk: riskFromTarget(target),
        status: statusLabel(code),
      };
    });

  const logOutput = await runGit(root, ['log', '-n', '8', '--pretty=format:%h%x09%ad%x09%s', '--date=short']);
  const commits = logOutput
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [hash, date, ...subjectParts] = line.split('\t');
      return {
        hash,
        date,
        subject: subjectParts.join('\t'),
      };
    });

  return { statusItems, commits };
}

async function collectSkills(root: string): Promise<SkillItem[]> {
  const skillRoots = [
    path.join(root, '.opencode', 'skills'),
    path.join(root, '.agents', 'skills'),
    path.join(os.homedir(), '.config', 'opencode', 'skills'),
    path.join(os.homedir(), '.agents', 'skills'),
  ];

  const skills: SkillItem[] = [];
  const seen = new Set<string>();

  for (const skillRoot of skillRoots) {
    if (!(await pathExists(skillRoot))) continue;
    const entries = await fs.readdir(skillRoot, { withFileTypes: true }).catch(() => []);

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const skillPath = path.join(skillRoot, entry.name);
      const skillFile = path.join(skillPath, 'SKILL.md');
      if (!(await pathExists(skillFile))) continue;
      if (seen.has(skillFile)) continue;
      seen.add(skillFile);

      const markdown = await readText(skillFile, 8000).catch(() => '');
      const frontMatter = parseFrontMatter(markdown);
      const scope = skillPath.startsWith(root) ? 'project' : 'global';
      const description = readString(frontMatter, ['description'], firstMarkdownParagraph(markdown) || 'Không có mô tả trong SKILL.md.');

      skills.push({
        name: readString(frontMatter, ['name'], entry.name),
        scope,
        source: skillPath,
        status: description ? 'valid' : 'needs review',
        risk: scope === 'project' ? 'low' : 'medium',
        description,
      });
    }
  }

  return skills.sort((left, right) => left.name.localeCompare(right.name)).slice(0, 60);
}

async function collectOpenCodeSkills(): Promise<SkillItem[]> {
  try {
    await ensureOpenCodeServer();
    const body = await openCodeJson<Array<Record<string, unknown>>>('/skill', { method: 'GET' }, undefined, 10000);
    return body
      .map((skill) => {
        const name = typeof skill.name === 'string' ? skill.name : '';
        if (!name) return null;
        const source = typeof skill.location === 'string' ? skill.location : 'opencode';
        return {
          name,
          scope: source === '<built-in>' ? 'builtin' : 'opencode',
          source,
          status: 'available',
          risk: source === '<built-in>' ? 'low' as Risk : 'medium' as Risk,
          description: typeof skill.description === 'string' ? skill.description : 'OpenCode skill.',
        };
      })
      .filter((skill): skill is SkillItem => !!skill)
      .sort((left, right) => left.name.localeCompare(right.name))
      .slice(0, 60);
  } catch {
    return [];
  }
}

function mergeSkills(openCodeSkills: SkillItem[], fileSkills: SkillItem[]): SkillItem[] {
  if (openCodeSkills.length === 0) {
    return fileSkills;
  }

  const runtimeNames = new Set(openCodeSkills.map((skill) => skill.name.toLowerCase()));
  const pendingRuntimeSkills = fileSkills
    .filter((skill) => !runtimeNames.has(skill.name.toLowerCase()))
    .map((skill) => ({
      ...skill,
      status: skill.status === 'needs review' ? skill.status : 'loading',
    }));

  return [...openCodeSkills, ...pendingRuntimeSkills]
    .sort((left, right) => left.name.localeCompare(right.name))
    .slice(0, 80);
}

async function collectAgents(root: string): Promise<AgentItem[]> {
  const agentRoots = [
    path.join(root, '.opencode', 'agents'),
    path.join(root, '.agents', 'agents'),
    path.join(os.homedir(), '.agents', 'agents'),
  ];
  const agents: AgentItem[] = [];

  for (const agentRoot of agentRoots) {
    if (!(await pathExists(agentRoot))) continue;
    const entries = await fs.readdir(agentRoot, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== '.md') continue;
      const sourcePath = path.join(agentRoot, entry.name);
      const markdown = await readText(sourcePath, 8000).catch(() => '');
      const frontMatter = parseFrontMatter(markdown);
      const permissions = frontMatter.permissions || frontMatter.permission || 'not declared';
      agents.push({
        name: readString(frontMatter, ['name'], path.basename(entry.name, '.md')),
        mode: readString(frontMatter, ['mode'], 'agent'),
        model: readString(frontMatter, ['model'], 'default'),
        permissions: formatPermission(permissions),
        risk: riskFromPermission('agent', stringifyPermission(permissions)),
        description: readString(frontMatter, ['description'], ''),
        sourcePath,
        builtIn: false,
      });
    }
  }

  return agents;
}

function readString(record: Record<string, unknown>, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return fallback;
}

function formatModel(value: unknown) {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const providerID = readString(record, ['providerID', 'providerId', 'provider']);
    const modelID = readString(record, ['modelID', 'modelId', 'id', 'name']);
    if (providerID && modelID) return `${providerID}/${modelID}`;
    if (modelID) return modelID;
  }
  return 'default';
}

function stringifyPermission(value: unknown) {
  if (!value) return 'default';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return 'declared';
  }
}

function formatPermission(value: unknown) {
  if (!value) return 'default';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return `${value.length} rule${value.length === 1 ? '' : 's'}`;
  if (typeof value === 'object') {
    const count = Object.keys(value as Record<string, unknown>).length;
    return count > 0 ? `${count} rule${count === 1 ? '' : 's'}` : 'declared';
  }
  return 'declared';
}

function mapOpenCodeAgent(agent: Record<string, unknown>): AgentItem | null {
  const name = readString(agent, ['name', 'id', 'key']);
  if (!name) return null;
  const permissionSource = agent.permission ?? agent.permissions;
  const permission = formatPermission(permissionSource);
  return {
    name,
    mode: readString(agent, ['mode', 'type'], 'agent'),
    model: formatModel(agent.model),
    permissions: permission,
    risk: riskFromPermission('agent', stringifyPermission(permissionSource)),
    description: readString(agent, ['description', 'summary'], ''),
    sourcePath: readString(agent, ['path', 'filePath', 'sourcePath'], `${readString(agent, ['source'], 'opencode')}:/${name}`),
    builtIn: agent.native === true,
  };
}

async function collectOpenCodeAgents() {
  try {
    await ensureOpenCodeServer();
    const body = await openCodeJson<unknown>('/agent', { method: 'GET' }, undefined, 10000);
    if (!Array.isArray(body)) return [];
    return body
      .map((agent) => (agent && typeof agent === 'object' ? mapOpenCodeAgent(agent as Record<string, unknown>) : null))
      .filter((agent): agent is AgentItem => !!agent)
      .sort((left, right) => left.name.localeCompare(right.name));
  } catch {
    return [];
  }
}

function mergeAgents(openCodeAgents: AgentItem[], fileAgents: AgentItem[]) {
  const localNames = new Set(fileAgents.map((agent) => agent.name.toLowerCase()));
  return [
    ...openCodeAgents.filter((agent) => !localNames.has(agent.name.toLowerCase())),
    ...fileAgents,
  ].sort((left, right) => left.name.localeCompare(right.name));
}

async function collectCommands(root: string): Promise<CommandItem[]> {
  const commandRoots = [
    path.join(root, '.opencode', 'commands'),
    path.join(root, '.agents', 'commands'),
  ];
  const commands: CommandItem[] = [];

  for (const commandRoot of commandRoots) {
    if (!(await pathExists(commandRoot))) continue;
    const entries = await fs.readdir(commandRoot, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== '.md') continue;
      const sourcePath = path.join(commandRoot, entry.name);
      const markdown = await readText(sourcePath, 8000).catch(() => '');
      const frontMatter = parseFrontMatter(markdown);
      commands.push({
        name: path.basename(entry.name, '.md'),
        description: readString(frontMatter, ['description'], firstMarkdownParagraph(markdown) || 'Không có mô tả command.'),
        sourcePath,
        preview: markdown.slice(0, 1200),
        source: 'project',
        builtIn: false,
        agent: readString(frontMatter, ['agent']) || undefined,
        model: readString(frontMatter, ['model']) || undefined,
      });
    }
  }

  return commands;
}

async function collectOpenCodeCommands(): Promise<CommandItem[]> {
  try {
    await ensureOpenCodeServer();
    const body = await openCodeJson<Array<Record<string, unknown>>>('/command', { method: 'GET' }, undefined, 10000);
    return body
      .filter((command) => command.source === 'command')
      .flatMap<CommandItem>((command) => {
        const name = typeof command.name === 'string' ? command.name : '';
        if (!name) return [];
        return [{
          name,
          description: typeof command.description === 'string' ? command.description : 'OpenCode command.',
          sourcePath: `command:/${name}`,
          preview: typeof command.template === 'string' ? command.template.slice(0, 1200) : '',
          source: 'command',
          builtIn: true,
          agent: typeof command.agent === 'string' ? command.agent : undefined,
          model: typeof command.model === 'string' ? command.model : undefined,
        }];
      })
  } catch {
    return [];
  }
}

function mergeCommands(openCodeCommands: CommandItem[], fileCommands: CommandItem[]) {
  const localNames = new Set(fileCommands.map((command) => command.name.toLowerCase()));
  return [
    ...openCodeCommands.filter((command) => !localNames.has(command.name.toLowerCase())),
    ...fileCommands,
  ].sort((left, right) => {
    if (left.builtIn !== right.builtIn) return left.builtIn ? -1 : 1;
    return left.name.localeCompare(right.name);
  });
}

function collectPermissions(parsedConfig: Record<string, unknown> | null): PermissionRow[] {
  const permissionSource = parsedConfig?.permission ?? parsedConfig?.permissions;
  if (!permissionSource || typeof permissionSource !== 'object' || Array.isArray(permissionSource)) {
    return [];
  }

  return Object.entries(permissionSource as Record<string, unknown>).map(([tool, value]) => {
    const effective = typeof value === 'string' ? value : JSON.stringify(value);
    return {
      tool,
      project: effective,
      global: 'not declared',
      effective,
      risk: riskFromPermission(tool, effective),
    };
  });
}

function collectMcp(parsedConfig: Record<string, unknown> | null, scope: McpServer['scope']): McpServer[] {
  const mcpSource = parsedConfig?.mcp ?? parsedConfig?.mcpServers;
  if (!mcpSource || typeof mcpSource !== 'object' || Array.isArray(mcpSource)) {
    return [];
  }

  return Object.entries(mcpSource as Record<string, Record<string, unknown>>).map(([name, config]) => {
    const transport = String(config.transport || config.type || (config.command ? 'stdio' : 'remote'));
    const enabled = config.enabled !== false;
    return {
      name,
      transport,
      status: enabled ? 'info' : 'neutral',
      latency: enabled ? 'not tested' : 'disabled',
      risk: transport === 'remote' || config.url ? 'high' : 'medium',
      scope,
      enabled,
      url: typeof config.url === 'string' ? config.url : undefined,
    };
  });
}

function mergeMcpServers(runtimeServers: McpServer[], projectServers: McpServer[]) {
  const projectNames = new Set(projectServers.map((server) => server.name.toLowerCase()));
  return [
    ...runtimeServers.filter((server) => !projectNames.has(server.name.toLowerCase())),
    ...projectServers,
  ].sort((left, right) => {
    if (left.scope !== right.scope) return left.scope === 'project' ? -1 : 1;
    return left.name.localeCompare(right.name);
  });
}

function buildDirectoryQuery(directory: string) {
  return new URLSearchParams({ directory }).toString();
}

async function collectOpenCodeConfig(root: string) {
  try {
    await ensureOpenCodeServer();
    return await openCodeJson<Record<string, unknown>>(`/config?${buildDirectoryQuery(root)}`, { method: 'GET' }, undefined, 10000);
  } catch {
    return null;
  }
}

async function collectOpenCodeSessions(): Promise<SessionItem[]> {
  try {
    await ensureOpenCodeServer();
    const body = await openCodeJson<Array<Record<string, unknown>>>('/session?scope=project&limit=30', { method: 'GET' }, undefined, 10000);
    return body.map((session) => {
      const time = session.time && typeof session.time === 'object' ? session.time as Record<string, unknown> : {};
      const model = session.model && typeof session.model === 'object' ? session.model as Record<string, unknown> : {};
      const modelId = typeof model.id === 'string' ? model.id : '';
      const providerId = typeof model.providerID === 'string' ? model.providerID : '';
      return {
        id: typeof session.id === 'string' ? session.id : '',
        title: typeof session.title === 'string' ? session.title : 'Untitled session',
        status: typeof time.archived === 'number' && time.archived > 0 ? 'archived' : 'active',
        model: providerId && modelId ? `${providerId}/${modelId}` : modelId || 'not declared',
        openCodeSessionId: typeof session.id === 'string' ? session.id : undefined,
        lastMessageAt: typeof time.updated === 'number' ? new Date(time.updated).toISOString() : undefined,
      };
    }).filter((session) => session.id);
  } catch {
    return [];
  }
}

async function collectCurrentOpenCodeProject(root: string) {
  try {
    await ensureOpenCodeServer();
    const body = await openCodeJson<Record<string, unknown>>('/project/current', { method: 'GET' }, undefined, 10000);
    const worktree = typeof body.worktree === 'string' ? body.worktree : root;
    return {
      id: typeof body.id === 'string' ? body.id : stableProjectId(root),
      name: typeof body.name === 'string' && body.name.trim() ? body.name : path.basename(worktree),
      rootPath: worktree,
    };
  } catch {
    return {
      id: stableProjectId(root),
      name: path.basename(root),
      rootPath: root,
    };
  }
}

function buildAudit(statusItems: Awaited<ReturnType<typeof collectGit>>['statusItems'], commits: Awaited<ReturnType<typeof collectGit>>['commits']): AuditItem[] {
  const workingTreeAudit: AuditItem[] = statusItems.map((item) => ({
    action: `git.${item.status}`,
    target: item.target,
    risk: item.risk,
    status: 'working-tree',
    time: 'now',
  }));

  const commitAudit: AuditItem[] = commits.map((commit) => ({
    action: 'git.commit',
    target: `${commit.hash} ${commit.subject}`,
    risk: 'low',
    status: 'committed',
    time: commit.date,
  }));

  return [...workingTreeAudit, ...commitAudit].slice(0, 40);
}

function buildRiskQueue(
  configFiles: ConfigFile[],
  permissions: PermissionRow[],
  mcpServers: McpServer[],
  gitStatus: Awaited<ReturnType<typeof collectGit>>['statusItems'],
) {
  const queue: RiskQueueItem[] = [];

  if (!configFiles.some((file) => file.name.startsWith('opencode'))) {
    queue.push({
      title: 'OpenCode config missing',
      detail: 'Workspace chưa có opencode.json hoặc opencode.jsonc.',
      risk: 'medium',
    });
  }

  for (const permission of permissions.filter((permission) => permission.risk === 'high' || permission.risk === 'critical')) {
    queue.push({
      title: `Permission ${permission.tool}`,
      detail: `Effective policy: ${permission.effective}`,
      risk: permission.risk,
    });
  }

  for (const server of mcpServers.filter((server) => server.risk === 'high' || server.risk === 'critical')) {
    queue.push({
      title: `MCP ${server.name}`,
      detail: `${server.transport} server cần review trước khi bật.`,
      risk: server.risk,
    });
  }

  for (const item of gitStatus.slice(0, 6)) {
    queue.push({
      title: `Working tree ${item.status}`,
      detail: item.target,
      risk: item.risk,
    });
  }

  return queue.slice(0, 10);
}

function buildQuickActions(state: {
  agents: AgentItem[];
  permissions: PermissionRow[];
  skills: SkillItem[];
  mcpServers: McpServer[];
  audit: AuditItem[];
}) {
  const actions = [];
  actions.push(state.agents.length > 0 ? `Review ${state.agents.length} agents` : 'Create first agent');
  actions.push(state.permissions.length > 0 ? `Review ${state.permissions.length} permissions` : 'Scan permissions');
  actions.push(state.skills.length > 0 ? `Validate ${state.skills.length} skills` : 'Find skills');
  actions.push(state.mcpServers.length > 0 ? `Test ${state.mcpServers.length} MCP servers` : 'Configure MCP server');
  actions.push(state.audit.length > 0 ? `Summarize ${state.audit.length} audit items` : 'Open audit log');
  return actions;
}

function getOpenCodeBaseUrl() {
  return getDefaultOpenCodeBaseUrl();
}

function buildOpenCodeHeaders() {
  return new Headers();
}

function collectProviderModels(provider: Record<string, unknown>) {
  const providerId = String(provider.id ?? provider.providerID ?? provider.name ?? '').trim();
  const models = provider.models;
  if (!providerId || !models) return [];

  if (Array.isArray(models)) {
    return models
      .map((model) => {
        if (typeof model === 'string') return `${providerId}/${model}`;
        if (model && typeof model === 'object') {
          const modelRecord = model as Record<string, unknown>;
          const modelId = String(modelRecord.id ?? modelRecord.modelID ?? modelRecord.name ?? '').trim();
          return modelId ? `${providerId}/${modelId}` : '';
        }
        return '';
      })
      .filter(Boolean);
  }

  if (typeof models === 'object') {
    return Object.keys(models).map((modelId) => `${providerId}/${modelId}`);
  }

  return [];
}

function formatOpenCodeApiModel(model: Record<string, unknown>) {
  const providerId = String(model.providerID ?? model.providerId ?? model.provider ?? '').trim();
  const modelId = String(model.id ?? model.modelID ?? model.modelId ?? model.apiID ?? model.apiId ?? model.name ?? '').trim();
  if (!modelId) return '';
  if (!providerId) return modelId;
  return modelId.startsWith(`${providerId}/`) ? modelId : `${providerId}/${modelId}`;
}

async function collectOpenCodeModels() {
  try {
    await ensureOpenCodeServer();
    const apiModels = await openCodeJson<unknown>('/api/model', { method: 'GET' }, undefined, 15000);
    if (Array.isArray(apiModels)) {
      const models = apiModels
        .map((model) => (model && typeof model === 'object' ? formatOpenCodeApiModel(model as Record<string, unknown>) : ''))
        .filter(Boolean);
      if (models.length > 0) {
        return Array.from(new Set(models)).sort((left, right) => left.localeCompare(right));
      }
    }
  } catch {
    // Fall back to configured providers below; some OpenCode versions do not expose /api/model.
  }

  try {
    await ensureOpenCodeServer();
    const body = await openCodeJson<{ providers?: unknown; default?: unknown }>('/config/providers', { method: 'GET' }, undefined, 10000);
    const defaults = body.default && typeof body.default === 'object'
      ? Object.entries(body.default).flatMap(([providerId, value]) => {
        if (typeof value !== 'string' || !value.trim()) return [];
        return value.includes('/') ? value : `${providerId}/${value}`;
      })
      : [];
    const providerModels = Array.isArray(body.providers)
      ? body.providers.flatMap((provider) => (provider && typeof provider === 'object' ? collectProviderModels(provider as Record<string, unknown>) : []))
      : [];
    return Array.from(new Set([...defaults, ...providerModels].filter(Boolean))).sort((left, right) => left.localeCompare(right));
  } catch {
    return [];
  }
}

async function collectOpenCodeProviders(root: string) {
  try {
    await ensureOpenCodeServer();
    const body = await openCodeJson<{ providers?: unknown }>(`/config/providers?${buildDirectoryQuery(root)}`, { method: 'GET' }, undefined, 10000);
    if (!Array.isArray(body.providers)) return [];

    return body.providers
      .flatMap((provider) => {
        if (!provider || typeof provider !== 'object') return [];
        const record = provider as Record<string, unknown>;
        const id = typeof record.id === 'string' ? record.id.trim() : '';
        const name = typeof record.name === 'string' && record.name.trim() ? record.name.trim() : id;
        const source = typeof record.source === 'string' && record.source.trim() ? record.source.trim() : 'unknown';
        return id ? [{ id, name, source }] : [];
      })
      .sort((left, right) => left.name.localeCompare(right.name));
  } catch {
    return [];
  }
}

async function checkOpenCodeServer() {
  const baseUrl = getOpenCodeBaseUrl();
  if (!baseUrl) {
    return {
      value: 'Not configured',
      detail: 'Thêm server.hostname/server.port trong opencode.json.',
      tone: 'neutral' as StatusTone,
    };
  }

  const startedAt = Date.now();
  try {
    const response = await fetch(`${baseUrl}/global/health`, { method: 'GET', headers: buildOpenCodeHeaders(), signal: AbortSignal.timeout(1800) });
    if (response.status === 401) {
      return {
        value: 'Auth required',
        detail: `${baseUrl} - restart OpenCode server để nạp opencode.json`,
        tone: 'warning' as StatusTone,
      };
    }
    const body = await response.json().catch(() => ({})) as { version?: unknown };
    const version = typeof body.version === 'string' ? body.version : 'unknown';
    return {
      value: response.ok ? 'Online' : `HTTP ${response.status}`,
      detail: `${baseUrl} · ${Date.now() - startedAt}ms`,
      tone: response.ok ? 'success' as StatusTone : 'warning' as StatusTone,
    };
  } catch {
    return {
      value: 'Offline',
      detail: baseUrl,
      tone: 'danger' as StatusTone,
    };
  }
}

export async function getWorkspaceAppState(): Promise<AppState> {
  const root = resolveWorkspaceRoot();
  const packageJson = await collectPackage(root);
  const config = await collectConfig(root);
  const git = await collectGit(root);
  const [fileSkills, openCodeSkills, fileAgents, openCodeAgents, fileCommands, openCodeCommands, sessions, openCodeServer, openCodeConfig, models, providers, openCodeProject] = await Promise.all([
    collectSkills(root),
    collectOpenCodeSkills(),
    collectAgents(root),
    collectOpenCodeAgents(),
    collectCommands(root),
    collectOpenCodeCommands(),
    collectOpenCodeSessions(),
    checkOpenCodeServer(),
    collectOpenCodeConfig(root),
    collectOpenCodeModels(),
    collectOpenCodeProviders(root),
    collectCurrentOpenCodeProject(root),
  ]);
  const agents = mergeAgents(openCodeAgents, fileAgents);
  const skills = mergeSkills(openCodeSkills, fileSkills);
  const commands = mergeCommands(openCodeCommands, fileCommands);

  const permissions = collectPermissions((openCodeConfig ?? config.parsedConfig) as Record<string, unknown> | null);
  const mcpServers = mergeMcpServers(
    collectMcp(openCodeConfig, 'global'),
    collectMcp(config.parsedConfig, 'project'),
  );
  const audit = buildAudit(git.statusItems, git.commits);
  const riskQueue = buildRiskQueue(config.files, permissions, mcpServers, git.statusItems);
  const backupsPath = path.join(root, '.pro-chatbot', 'backups');
  const backupsCount = (await pathExists(backupsPath))
    ? await fs.readdir(backupsPath).then((entries) => entries.length).catch(() => 0)
    : 0;

  const invalidConfig = config.files.find((file) => file.valid === false);
  const validConfigCount = config.files.filter((file) => file.valid === true).length;
  const configHealth = invalidConfig
    ? { value: 'Invalid', detail: invalidConfig.name, tone: 'danger' as StatusTone }
    : validConfigCount > 0
      ? { value: 'Valid', detail: `${validConfigCount} config file(s) parsed`, tone: 'success' as StatusTone }
      : { value: 'Missing', detail: 'No OpenCode config found', tone: 'warning' as StatusTone };

  const dashboardState = {
    agents,
    permissions,
    skills,
    mcpServers,
    audit,
  };

  return {
    generatedAt: new Date().toISOString(),
    project: {
      id: openCodeProject.id,
      name: openCodeProject.name,
      rootPath: openCodeProject.rootPath,
      configPath: config.configPath,
      tuiConfigPath: config.tuiConfigPath,
      platform: `${os.platform()} ${os.arch()}`,
      packageName: typeof packageJson?.name === 'string' ? packageJson.name : null,
      packageVersion: typeof packageJson?.version === 'string' ? packageJson.version : null,
    },
    navBadges: {
      permissions: permissions.filter((permission) => permission.risk === 'high' || permission.risk === 'critical').length,
      audit: audit.length,
    },
    quickActions: buildQuickActions(dashboardState),
    dashboard: {
      metrics: [
        {
          title: 'OpenCode server',
          value: openCodeServer.value,
          detail: openCodeServer.detail,
          tone: openCodeServer.tone,
        },
        {
          title: 'Config health',
          value: configHealth.value,
          detail: configHealth.detail,
          tone: configHealth.tone,
        },
        {
          title: 'Risk queue',
          value: `${riskQueue.length} item(s)`,
          detail: riskQueue.length ? 'Derived from config, MCP and git status' : 'No active risk items',
          tone: riskQueue.length ? 'warning' : 'success',
        },
        {
          title: 'Backups',
          value: `${backupsCount} snapshot(s)`,
          detail: backupsPath,
          tone: backupsCount > 0 ? 'info' : 'neutral',
        },
      ],
      projectStatus: [
        { label: 'Root path', value: root },
        { label: 'Config path', value: config.configPath ?? 'not found' },
        { label: 'Platform', value: `${os.platform()} · ${os.arch()}` },
        { label: 'Package', value: packageJson?.name ? `${packageJson.name}@${packageJson.version ?? 'unknown'}` : 'not found' },
      ],
      riskQueue,
      recentAudit: audit.slice(0, 8),
    },
    config: {
      files: config.files,
      previewPath: config.previewPath,
      preview: config.preview,
      effective: (config.parsedConfig ?? openCodeConfig) as Record<string, unknown> | null,
    },
    agents,
    permissions,
    skills,
    marketplace: skills
      .filter((skill) => skill.scope === 'global')
      .slice(0, 30)
      .map((skill) => ({
        id: `mkt_${crypto.createHash('sha1').update(path.join(skill.source, 'SKILL.md')).digest('hex').slice(0, 10)}`,
        name: skill.name,
        source: skill.source,
        license: 'declared in source',
        risk: skill.risk,
        description: skill.description,
      })),
    mcpServers,
    commands,
    models,
    providers,
    sessions,
    audit,
    settings: [
      { title: 'Backend port', value: process.env.PORT ?? 'not configured' },
      { title: 'Node environment', value: process.env.NODE_ENV ?? 'not configured' },
      { title: 'OpenCode server URL', value: getDefaultOpenCodeBaseUrl() },
      { title: 'Workspace root', value: root },
      { title: 'Data generated at', value: new Date().toLocaleString('vi-VN') },
    ],
  };
}
