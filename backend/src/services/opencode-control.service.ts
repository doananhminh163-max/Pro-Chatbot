import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { ApiError } from './opencode-control/errors.js';
import { parseJsonc, readJsonc, stringifyConfig } from './opencode-control/config-file.js';
import { responsePage } from './opencode-control/pagination.js';
import { ensureOpenCodeServer, openCodeFetch, openCodeJson, restartOpenCodeServer, type OpenCodeMessageResponse, type OpenCodePart, type OpenCodeSessionResponse } from './opencode-control/runtime.js';
import { parseFrontMatter, removeFrontMatter, toYamlLines } from './opencode-control/frontmatter.js';
import type {
  AppStateStore,
  ChatMessageRecord,
  ChatSessionRecord,
  ConfigBackupRecord,
  ConfigChangeRecord,
  ConfigFileInfo,
  MarketplaceSkillRecord,
  ProjectRecord,
  RiskLevel,
  ServerConnectionRecord,
} from './opencode-control/types.js';
import { getStateDirectory, makeId, now, pathExists, readText, resolveWorkspaceRoot, sha256, stableId, writeAtomic } from './opencode-control/utils.js';
import { assertProject, getDefaultServerConnection, isInside, loadState, resolveProjectPath, saveState, toProjectRelative } from './opencode-control/state-store.js';

const execFileAsync = promisify(execFile);

export { ApiError };
export {
  createProject,
  createServerConnection,
  deleteProject,
  getProjectStatus,
  listProjects,
  listServerConnections,
  testServerConnection,
} from './opencode-control/projects.service.js';
export type { ChangeStatus, ConfigChangeRecord, RiskLevel, StatusTone } from './opencode-control/types.js';

const BUILTIN_TOOLS = [
  { name: 'bash', source: 'builtin', description: 'Execute shell commands', riskLevel: 'high' as RiskLevel },
  { name: 'edit', source: 'builtin', description: 'Modify an existing file', riskLevel: 'high' as RiskLevel },
  { name: 'write', source: 'builtin', description: 'Write a new file', riskLevel: 'high' as RiskLevel },
  { name: 'read', source: 'builtin', description: 'Read file contents', riskLevel: 'low' as RiskLevel },
  { name: 'grep', source: 'builtin', description: 'Search text in files', riskLevel: 'low' as RiskLevel },
  { name: 'glob', source: 'builtin', description: 'Find files by pattern', riskLevel: 'low' as RiskLevel },
  { name: 'lsp', source: 'builtin', description: 'Language server lookup', riskLevel: 'medium' as RiskLevel },
  { name: 'apply_patch', source: 'builtin', description: 'Apply source code patches', riskLevel: 'high' as RiskLevel },
  { name: 'skill', source: 'builtin', description: 'Load an agent skill', riskLevel: 'medium' as RiskLevel },
  { name: 'todowrite', source: 'builtin', description: 'Manage task lists', riskLevel: 'low' as RiskLevel },
  { name: 'webfetch', source: 'builtin', description: 'Fetch a web page', riskLevel: 'medium' as RiskLevel },
  { name: 'websearch', source: 'builtin', description: 'Search the web', riskLevel: 'medium' as RiskLevel },
  { name: 'question', source: 'builtin', description: 'Ask the user for input', riskLevel: 'low' as RiskLevel },
];

const BUILTIN_AGENTS = [
  { name: 'build', mode: 'primary', description: 'Default implementation agent' },
  { name: 'plan', mode: 'primary', description: 'Planning agent' },
  { name: 'general', mode: 'primary', description: 'General purpose agent' },
  { name: 'explore', mode: 'subagent', description: 'Read-only exploration agent' },
  { name: 'scout', mode: 'subagent', description: 'Fast codebase scouting agent' },
  { name: 'compaction', mode: 'system', description: 'Context compaction agent' },
  { name: 'title', mode: 'system', description: 'Session title agent' },
  { name: 'summary', mode: 'system', description: 'Session summary agent' },
];

const FALLBACK_BUILTIN_COMMANDS = [
  { name: 'init', description: 'guided AGENTS.md setup', template: 'Create or update AGENTS.md for this repository.' },
  { name: 'undo', description: 'Undo last message in the conversation.', template: 'Undo the latest OpenCode session step.' },
  { name: 'redo', description: 'Redo a previously undone message.', template: 'Redo a previously undone OpenCode session step.' },
  { name: 'share', description: 'Share the current OpenCode session.', template: 'Share the current OpenCode session.' },
  { name: 'help', description: 'Show OpenCode help.', template: 'Show OpenCode help.' },
];

const TEXT_EXTENSIONS = new Set(['.json', '.jsonc', '.md', '.txt', '.toml', '.yaml', '.yml']);
const SECRET_NAME_PATTERN = /(api[_-]?key|token|password|secret|client[_-]?secret)/i;
const OPENCODE_RESTART_CHANGE_PREFIXES = ['agent.', 'skill.', 'mcp.'];
const CHANGE_REVIEW_DIFF_LIMIT = 180_000;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge<T extends Record<string, unknown>>(base: T, patch: Record<string, unknown>): T {
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = deepMerge(result[key] as Record<string, unknown>, value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

function removeUndefinedKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(removeUndefinedKeys);
  }
  if (!isPlainObject(value)) {
    return value;
  }
  const next: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (item !== undefined) {
      next[key] = removeUndefinedKeys(item);
    }
  }
  return next;
}

function deleteNestedKey(target: Record<string, unknown>, pathParts: string[]) {
  if (pathParts.length === 0) return;
  const [first, ...rest] = pathParts;
  if (rest.length === 0) {
    delete target[first];
    return;
  }
  if (isPlainObject(target[first])) {
    deleteNestedKey(target[first] as Record<string, unknown>, rest);
  }
}

function firstMarkdownParagraph(markdown: string) {
  return removeFrontMatter(markdown)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#'))
    ?.slice(0, 220) ?? '';
}

function sanitizeName(name: string, label = 'name') {
  const normalized = name.trim();
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(normalized)) {
    throw new ApiError(400, 'VALIDATION_ERROR', `${label} must use letters, numbers, hyphen or underscore`);
  }
  return normalized;
}

function redactSecrets(input: string) {
  return input
    .replace(/("(?:apiKey|api_key|token|password|secret|clientSecret|client_secret)"\s*:\s*)"[^"]*"/gi, '$1"[REDACTED]"')
    .replace(/((?:API_KEY|TOKEN|PASSWORD|SECRET|CLIENT_SECRET)\s*=\s*).+/gi, '$1[REDACTED]');
}

const INSTRUCTION_FILE_EXTENSIONS = new Set(['.md', '.txt']);

function shouldRestartOpenCodeForChange(type: string) {
  return OPENCODE_RESTART_CHANGE_PREFIXES.some((prefix) => type.startsWith(prefix));
}

async function restartOpenCodeForProject(project: ProjectRecord) {
  const state = await loadState();
  const currentProject = state.projects.find((item) => item.id === project.id) ?? project;
  return restartOpenCodeServer(getDefaultServerConnection(state, currentProject));
}

function isOpenCodeProjectConfigFile(targetPath: string) {
  return ['opencode.json', 'opencode.jsonc'].includes(path.basename(targetPath).toLowerCase());
}

async function syncOpenCodeConfigForProject(
  state: AppStateStore,
  project: ProjectRecord,
  config: Record<string, unknown>,
) {
  const connection = getDefaultServerConnection(state, project);
  const query = new URLSearchParams({ directory: project.rootPath }).toString();
  try {
    await ensureOpenCodeServer(connection);
    await openCodeJson<Record<string, unknown>>(`/config?${query}`, {
      method: 'PATCH',
      body: JSON.stringify(config),
    }, connection, 10000);
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : 'OpenCode runtime sync failed',
    };
  }
}

function stripAnsi(input: string) {
  return input.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
}

function removableSkillRoots(project: ProjectRecord) {
  return [
    path.join(project.rootPath, '.opencode', 'skills'),
    path.join(project.rootPath, '.agents', 'skills'),
    path.join(os.homedir(), '.config', 'opencode', 'skills'),
    path.join(os.homedir(), '.agents', 'skills'),
  ];
}

function findRemovableSkillRoot(project: ProjectRecord, skillDir: string) {
  const normalizedSkillDir = path.resolve(skillDir);
  return removableSkillRoots(project)
    .map((root) => path.resolve(root))
    .find((root) => isInside(root, normalizedSkillDir));
}

function makeUnifiedDiff(before: string, after: string, fromPath: string, toPath = fromPath) {
  const beforeLines = before.split(/\r?\n/);
  const afterLines = after.split(/\r?\n/);
  const lines = [`--- ${fromPath}`, `+++ ${toPath}`];
  const max = Math.max(beforeLines.length, afterLines.length);

  for (let index = 0; index < max; index += 1) {
    const beforeLine = beforeLines[index];
    const afterLine = afterLines[index];
    if (beforeLine === afterLine) {
      if (beforeLine !== undefined) lines.push(` ${beforeLine}`);
    } else {
      if (beforeLine !== undefined) lines.push(`-${beforeLine}`);
      if (afterLine !== undefined) lines.push(`+${afterLine}`);
    }
  }

  return redactSecrets(lines.join('\n'));
}

function detectSecrets(content: string) {
  const warnings: Array<{ code: string; message: string }> = [];
  const redacted = redactSecrets(content);
  if (redacted !== content && !content.includes('{env:') && !content.includes('{file:')) {
    warnings.push({
      code: 'SECRET_PLAINTEXT_BLOCKED',
      message: 'A secret-like value was detected. Use {env:NAME} or {file:path} references.',
    });
  }
  return warnings;
}

function riskFromContent(type: string, targetFile: string, content: string, patch?: unknown): RiskLevel {
  const normalized = `${type} ${targetFile} ${JSON.stringify(patch ?? {})} ${content}`.toLowerCase();
  if (detectSecrets(content).length > 0) return 'critical';
  if (normalized.includes('"*"') || normalized.includes('*:') || /permission[^]*allow/.test(normalized) && /(bash|shell|exec|edit|write)/.test(normalized)) {
    return 'critical';
  }
  if (/(bash|edit|write|delete|remote|mcp|marketplace|install)/.test(normalized)) {
    return 'high';
  }
  if (/(skill|command|model|provider|agent|server)/.test(normalized)) {
    return 'medium';
  }
  return 'low';
}

function warningFromRisk(riskLevel: RiskLevel, type: string) {
  const warnings: Array<{ code: string; message: string }> = [];
  if (riskLevel === 'high' || riskLevel === 'critical') {
    warnings.push({
      code: 'RISK_CONFIRMATION_REQUIRED',
      message: `${type} is a ${riskLevel}-risk change and requires explicit confirmation before apply.`,
    });
  }
  return warnings;
}

async function createFileChange(input: {
  state: AppStateStore;
  project: ProjectRecord;
  type: string;
  summary: string;
  targetFile: string;
  afterContent: string;
  patch?: unknown;
}) {
  const targetPath = resolveProjectPath(input.project, input.targetFile, { allowMissing: true });
  const beforeContent = await pathExists(targetPath) ? await readText(targetPath) : '';
  const relativePath = toProjectRelative(input.project, targetPath);
  const riskLevel = riskFromContent(input.type, relativePath, input.afterContent, input.patch);
  const warnings = [...detectSecrets(input.afterContent), ...warningFromRisk(riskLevel, input.type)];
  const change: ConfigChangeRecord = {
    id: makeId('chg'),
    projectId: input.project.id,
    type: input.type,
    summary: input.summary,
    targetFile: relativePath,
    diff: makeUnifiedDiff(beforeContent, input.afterContent, relativePath),
    riskLevel,
    status: 'previewed',
    warnings,
    createdAt: now(),
    beforeContent,
    afterContent: input.afterContent,
  };

  input.state.configChanges.unshift(change);
  input.state.auditLogs.unshift({
    id: makeId('audit'),
    configChangeId: change.id,
    actor: 'local-user',
    action: 'preview',
    targetType: 'config',
    targetId: relativePath,
    metadata: { type: input.type, riskLevel },
    createdAt: now(),
  });

  await saveState(input.state);
  return change;
}

async function createConfigPatchChange(input: {
  projectId: string;
  type: string;
  summary: string;
  targetFile?: string;
  patch: Record<string, unknown>;
}) {
  const state = await loadState();
  const project = assertProject(state, input.projectId);
  const targetFile = input.targetFile ?? (project.configPath ? toProjectRelative(project, project.configPath) : 'opencode.json');
  const targetPath = resolveProjectPath(project, targetFile, { allowMissing: true });
  const currentConfig = await pathExists(targetPath)
    ? await readJsonc(targetPath).catch((error) => {
      throw new ApiError(422, 'CONFIG_PARSE_ERROR', 'Could not parse current config before creating preview', error);
    })
    : {};
  const mergedConfig = removeUndefinedKeys(deepMerge(currentConfig as Record<string, unknown>, input.patch)) as Record<string, unknown>;
  return createFileChange({
    state,
    project,
    type: input.type,
    summary: input.summary,
    targetFile,
    afterContent: stringifyConfig(mergedConfig),
    patch: input.patch,
  });
}

async function collectConfigFile(project: ProjectRecord, filePath: string, kind: ConfigFileInfo['kind']): Promise<ConfigFileInfo> {
  const exists = await pathExists(filePath);
  if (!exists) {
    return { path: filePath, kind, exists: false, valid: null, content: null };
  }

  if (kind === 'directory') {
    return { path: filePath, kind, exists: true, valid: null, content: null };
  }

  try {
    return { path: filePath, kind, exists: true, valid: true, content: await readJsonc(filePath) };
  } catch (error) {
    return { path: filePath, kind, exists: true, valid: false, content: { error: error instanceof Error ? error.message : 'Parse failed' } };
  }
}

export async function readProjectConfig(projectId: string, scope = 'project') {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const files: ConfigFileInfo[] = [];

  if (scope === 'global' || scope === 'effective') {
    const globalConfig = path.join(os.homedir(), '.config', 'opencode', 'opencode.json');
    files.push(await collectConfigFile(project, globalConfig, 'opencode'));
  }

  if (scope === 'project' || scope === 'effective') {
    files.push(await collectConfigFile(project, path.join(project.rootPath, 'opencode.json'), 'opencode'));
    files.push(await collectConfigFile(project, path.join(project.rootPath, 'opencode.jsonc'), 'opencode'));
    files.push(await collectConfigFile(project, path.join(project.rootPath, 'tui.json'), 'tui'));
    files.push(await collectConfigFile(project, path.join(project.rootPath, '.opencode'), 'directory'));
  }

  if (scope === 'effective') {
    const merged = files
      .filter((file) => file.exists && file.valid && isPlainObject(file.content))
      .reduce<Record<string, unknown>>((result, file) => deepMerge(result, file.content as Record<string, unknown>), {});
    return { projectId: project.id, scope, files, effective: merged };
  }

  return { projectId: project.id, scope, files };
}

export async function previewConfigChange(projectId: string, input: {
  type?: string;
  targetFile?: string;
  patch?: Record<string, unknown>;
  content?: string;
  summary?: string;
}) {
  if (input.content !== undefined) {
    const state = await loadState();
    const project = assertProject(state, projectId);
    return createFileChange({
      state,
      project,
      type: input.type ?? 'config.update',
      summary: input.summary ?? 'Update config file',
      targetFile: input.targetFile ?? (project.configPath ? toProjectRelative(project, project.configPath) : 'opencode.json'),
      afterContent: input.content,
    });
  }

  if (!input.patch || !isPlainObject(input.patch)) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'patch or content is required');
  }

  return createConfigPatchChange({
    projectId,
    type: input.type ?? 'config.update',
    summary: input.summary ?? 'Update OpenCode config',
    targetFile: input.targetFile,
    patch: input.patch,
  });
}

export async function applyConfigChange(configChangeId: string, input: { confirmed?: boolean; confirmationText?: string }) {
  const state = await loadState();
  const change = state.configChanges.find((item) => item.id === configChangeId);
  if (!change) {
    throw new ApiError(404, 'CONFIG_CHANGE_NOT_FOUND', 'Config change not found');
  }
  if (change.status !== 'previewed') {
    throw new ApiError(409, 'CONFIG_CHANGE_NOT_PREVIEWED', 'Only previewed changes can be applied');
  }
  if ((change.riskLevel === 'high' || change.riskLevel === 'critical') && !input.confirmed && input.confirmationText !== 'I understand the risk') {
    throw new ApiError(403, 'RISK_CONFIRMATION_REQUIRED', 'High-risk changes require confirmation');
  }
  if (!change.targetFile || change.afterContent === undefined) {
    throw new ApiError(422, 'CONFIG_CHANGE_INVALID', 'Config change has no target content');
  }

  const project = assertProject(state, change.projectId);
  const targetPath = resolveProjectPath(project, change.targetFile, { allowMissing: true });
  const beforeContent = await pathExists(targetPath) ? await readText(targetPath) : '';
  let parsedJsonConfig: unknown;

  if (TEXT_EXTENSIONS.has(path.extname(targetPath).toLowerCase()) && ['.json', '.jsonc'].includes(path.extname(targetPath).toLowerCase())) {
    try {
      parsedJsonConfig = parseJsonc(change.afterContent);
    } catch (error) {
      change.status = 'failed';
      await saveState(state);
      throw new ApiError(422, 'CONFIG_PARSE_ERROR', 'Proposed config is not valid JSON/JSONC', error);
    }
  }

  const backupDir = path.join(getStateDirectory(), 'backups', project.id);
  await fs.mkdir(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `${new Date().toISOString().replace(/[:.]/g, '-')}-${path.basename(targetPath)}.bak`);
  await fs.writeFile(backupPath, beforeContent, 'utf8');
  await writeAtomic(targetPath, change.afterContent);

  const backup: ConfigBackupRecord = {
    id: makeId('bak'),
    projectId: project.id,
    configChangeId: change.id,
    filePath: toProjectRelative(project, targetPath),
    backupPath,
    createdAt: now(),
  };
  state.backups.unshift(backup);
  change.status = 'applied';
  change.appliedAt = now();
  state.auditLogs.unshift({
    id: makeId('audit'),
    configChangeId: change.id,
    actor: 'local-user',
    action: 'apply',
    targetType: 'config',
    targetId: change.targetFile,
    metadata: { riskLevel: change.riskLevel, backupId: backup.id },
    createdAt: now(),
  });
  await saveState(state);
  const openCodeSync = isOpenCodeProjectConfigFile(targetPath) && isPlainObject(parsedJsonConfig)
    ? await syncOpenCodeConfigForProject(state, project, parsedJsonConfig)
    : undefined;
  const openCodeRestart = shouldRestartOpenCodeForChange(change.type)
    ? await restartOpenCodeForProject(project)
    : undefined;

  return {
    configChangeId: change.id,
    status: change.status,
    backups: [backup],
    verifyResult: openCodeSync?.ok === false
      ? { ok: false, error: openCodeSync.error }
      : { ok: true },
    ...(openCodeSync ? { openCodeSync } : {}),
    ...(openCodeRestart ? { openCodeRestart } : {}),
  };
}

export async function uploadInstructionFiles(projectId: string, files: Array<{ originalname: string; buffer: Buffer }>) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  if (files.length === 0) {
    throw new ApiError(400, 'INSTRUCTION_FILES_REQUIRED', 'At least one instruction file is required');
  }

  const targetDirectory = path.join(project.rootPath, '.opencode', 'instructions');
  await fs.mkdir(targetDirectory, { recursive: true });

  const paths: string[] = [];
  for (const file of files) {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!INSTRUCTION_FILE_EXTENSIONS.has(extension)) {
      throw new ApiError(400, 'INVALID_INSTRUCTION_FILE', 'Only .md and .txt instruction files are allowed');
    }
    const baseName = sanitizeInstructionFileName(path.basename(file.originalname, extension));
    const targetPath = await nextAvailableInstructionPath(targetDirectory, baseName, extension);
    await writeAtomic(targetPath, file.buffer.toString('utf8'));
    paths.push(toProjectRelative(project, targetPath).replace(/\\/g, '/'));
  }

  return { paths };
}

function sanitizeInstructionFileName(fileName: string) {
  const sanitized = fileName.trim().replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return sanitized || 'instruction';
}

async function nextAvailableInstructionPath(directory: string, baseName: string, extension: string) {
  let suffix = 0;
  while (true) {
    const candidateName = suffix === 0 ? `${baseName}${extension}` : `${baseName}-${suffix + 1}${extension}`;
    const candidatePath = path.join(directory, candidateName);
    if (!(await pathExists(candidatePath))) {
      return candidatePath;
    }
    suffix += 1;
  }
}

export async function listConfigBackups(projectId: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  return state.backups.filter((backup) => backup.projectId === project.id);
}

export async function rollbackConfig(projectId: string, backupId: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const backup = state.backups.find((item) => item.projectId === project.id && item.id === backupId);
  if (!backup) {
    throw new ApiError(404, 'BACKUP_NOT_FOUND', 'Backup not found');
  }
  const targetPath = resolveProjectPath(project, backup.filePath, { allowMissing: true });
  const backupContent = await readText(backup.backupPath).catch(() => {
    throw new ApiError(500, 'ROLLBACK_FAILED', 'Backup file could not be read');
  });
  await writeAtomic(targetPath, backupContent);
  state.auditLogs.unshift({
    id: makeId('audit'),
    actor: 'local-user',
    action: 'rollback',
    targetType: 'config',
    targetId: backup.filePath,
    metadata: { backupId },
    createdAt: now(),
  });
  await saveState(state);
  return { status: 'rolled_back', backupId };
}

function buildAgentMarkdown(input: {
  name: string;
  description: string;
  mode?: string;
  model?: string;
  temperature?: number;
  maxSteps?: number;
  disable?: boolean;
  tools?: Record<string, unknown>;
  permission?: Record<string, unknown>;
  taskPermission?: Record<string, unknown>;
  topP?: number;
  prompt: string;
}) {
  const lines: string[] = [
    '---',
    ...toYamlLines('name', input.name),
    ...toYamlLines('description', input.description),
    ...toYamlLines('mode', input.mode ?? 'subagent'),
  ];
  if (input.model) lines.push(...toYamlLines('model', input.model));
  if (input.temperature !== undefined) lines.push(...toYamlLines('temperature', input.temperature));
  if (input.maxSteps !== undefined) lines.push(...toYamlLines('steps', input.maxSteps));
  if (input.disable !== undefined) lines.push(...toYamlLines('disable', input.disable));
  if (input.tools) lines.push(...toYamlLines('tools', input.tools));
  const permission = input.taskPermission
    ? { ...(input.permission ?? {}), task: input.taskPermission }
    : input.permission;
  if (permission) lines.push(...toYamlLines('permission', permission));
  if (input.topP !== undefined) lines.push(...toYamlLines('top_p', input.topP));
  lines.push('---', '', input.prompt.trim() || 'You are an OpenCode agent. Follow project instructions and report clearly.', '');
  return lines.join('\n');
}

function readFrontMatterString(frontMatter: Record<string, unknown>, key: string, fallback = '') {
  const value = frontMatter[key];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function parseMaybeJson(value: unknown) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return '';
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function parseOptionalNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function parseOptionalBoolean(value: unknown) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }
  return undefined;
}

function splitAgentPermission(value: unknown) {
  const parsed = parseMaybeJson(value);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { permission: parsed ?? '', taskPermission: '' };
  }

  const record = { ...(parsed as Record<string, unknown>) };
  const taskPermission = record.task ?? '';
  delete record.task;
  return {
    permission: Object.keys(record).length > 0 ? record : '',
    taskPermission,
  };
}

async function scanAgentFiles(project: ProjectRecord) {
  const agentRoots = [
    path.join(project.rootPath, '.opencode', 'agents'),
    path.join(project.rootPath, '.agents', 'agents'),
    path.join(os.homedir(), '.config', 'opencode', 'agents'),
    path.join(os.homedir(), '.agents', 'agents'),
  ];
  const agents = [];
  const seen = new Set<string>();

  for (const agentRoot of agentRoots) {
    if (!(await pathExists(agentRoot))) continue;
    const entries = await fs.readdir(agentRoot, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== '.md') continue;
      const sourcePath = path.join(agentRoot, entry.name);
      if (seen.has(sourcePath)) continue;
      seen.add(sourcePath);
      const markdown = await readText(sourcePath, 16000).catch(() => '');
      const frontMatter = parseFrontMatter(markdown);
      const permissionParts = splitAgentPermission(frontMatter.permission || frontMatter.permissions || '');
      agents.push({
        name: readFrontMatterString(frontMatter, 'name', path.basename(entry.name, '.md')),
        mode: readFrontMatterString(frontMatter, 'mode', 'subagent'),
        description: readFrontMatterString(frontMatter, 'description'),
        source: sourcePath.startsWith(project.rootPath) ? 'project' : 'global',
        filePath: sourcePath,
        builtIn: false,
        enabled: !parseOptionalBoolean(frontMatter.disable ?? frontMatter.disabled),
        disable: parseOptionalBoolean(frontMatter.disable ?? frontMatter.disabled),
        model: readFrontMatterString(frontMatter, 'model', 'default'),
        tools: parseMaybeJson(frontMatter.tools ?? ''),
        permission: permissionParts.permission,
        taskPermission: permissionParts.taskPermission,
        temperature: parseOptionalNumber(frontMatter.temperature),
        maxSteps: parseOptionalNumber(frontMatter.steps ?? frontMatter.max_steps ?? frontMatter.maxSteps),
        topP: parseOptionalNumber(frontMatter.top_p ?? frontMatter.topP),
        prompt: removeFrontMatter(markdown),
      });
    }
  }

  return agents;
}

function readRecordString(record: Record<string, unknown>, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return fallback;
}

function formatOpenCodeModel(value: unknown) {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const providerID = readRecordString(record, ['providerID', 'providerId', 'provider']);
    const modelID = readRecordString(record, ['modelID', 'modelId', 'id', 'name']);
    if (providerID && modelID) return `${providerID}/${modelID}`;
    if (modelID) return modelID;
  }
  return 'default';
}

function formatOpenCodePermission(value: unknown) {
  if (!value) return 'default';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return 'declared';
  }
}

function mapOpenCodeAgent(agent: Record<string, unknown>) {
  const name = readRecordString(agent, ['name', 'id', 'key']);
  if (!name) return null;
  const permissionParts = splitAgentPermission(agent.permission ?? agent.permissions ?? '');
  const sourcePath = readRecordString(agent, ['path', 'filePath', 'sourcePath'], '');
  const options = agent.options && typeof agent.options === 'object' && !Array.isArray(agent.options)
    ? agent.options as Record<string, unknown>
    : {};
  const native = agent.native === true;
  return {
    name,
    mode: readRecordString(agent, ['mode', 'type'], 'agent'),
    description: readRecordString(agent, ['description', 'summary'], ''),
    source: readRecordString(agent, ['source'], sourcePath ? (sourcePath.startsWith(process.cwd()) ? 'project' : 'global') : 'opencode'),
    filePath: sourcePath || null,
    builtIn: native,
    enabled: agent.disable !== true && agent.disabled !== true,
    disable: typeof agent.disable === 'boolean' ? agent.disable : typeof agent.disabled === 'boolean' ? agent.disabled : undefined,
    model: formatOpenCodeModel(agent.model),
    tools: parseMaybeJson(agent.tools ?? options.tools ?? ''),
    permission: permissionParts.permission || formatOpenCodePermission(agent.permission ?? agent.permissions),
    taskPermission: permissionParts.taskPermission,
    temperature: parseOptionalNumber(agent.temperature ?? options.temperature),
    maxSteps: parseOptionalNumber(agent.steps ?? agent.maxSteps ?? agent.max_steps ?? options.steps ?? options.maxSteps ?? options.max_steps),
    topP: parseOptionalNumber(agent.top_p ?? agent.topP ?? options.top_p ?? options.topP),
    prompt: typeof agent.prompt === 'string' ? agent.prompt : '',
  };
}

async function listOpenCodeAgents(connection?: ServerConnectionRecord) {
  await ensureOpenCodeServer(connection);
  const agents = await openCodeJson<Array<Record<string, unknown>>>('/agent', { method: 'GET' }, connection, 10000);
  return agents
    .map((agent) => (agent && typeof agent === 'object' ? mapOpenCodeAgent(agent) : null))
    .filter((agent): agent is NonNullable<ReturnType<typeof mapOpenCodeAgent>> => !!agent)
    .sort((left, right) => left.name.localeCompare(right.name));
}

export async function listAgents(projectId: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);
  const localAgents = await scanAgentFiles(project);
  try {
    const runtimeAgents = await listOpenCodeAgents(connection);
    const localNames = new Set(localAgents.map((agent) => agent.name.toLowerCase()));
    return [
      ...runtimeAgents.filter((agent) => !localNames.has(agent.name.toLowerCase())),
      ...localAgents,
    ].sort((left, right) => left.name.localeCompare(right.name));
  } catch {
    // Fallback keeps the UI usable when OpenCode is offline or not authenticated.
  }
  const localNames = new Set(localAgents.map((agent) => agent.name));
  const builtIns = BUILTIN_AGENTS
    .filter((agent) => !localNames.has(agent.name))
    .map((agent) => ({
      ...agent,
      source: 'builtin',
      filePath: null,
      builtIn: true,
      enabled: true,
      disable: false,
      model: 'default',
      tools: '',
      permission: 'default',
      taskPermission: '',
      temperature: undefined,
      maxSteps: undefined,
      topP: undefined,
      prompt: '',
    }));
  return [...builtIns, ...localAgents];
}

export async function createAgent(projectId: string, input: {
  name: string;
  description?: string;
  mode?: string;
  model?: string;
  temperature?: number;
  maxSteps?: number;
  disable?: boolean;
  tools?: Record<string, unknown>;
  permission?: Record<string, unknown>;
  taskPermission?: Record<string, unknown>;
  topP?: number;
  prompt?: string;
}) {
  const name = sanitizeName(input.name, 'agent name');
  const markdown = buildAgentMarkdown({
    name,
    description: input.description ?? `${name} agent`,
    mode: input.mode,
    model: input.model,
    temperature: input.temperature,
    maxSteps: input.maxSteps,
    disable: input.disable,
    tools: input.tools,
    permission: input.permission,
    taskPermission: input.taskPermission,
    topP: input.topP,
    prompt: input.prompt ?? '',
  });
  const state = await loadState();
  const project = assertProject(state, projectId);
  return createFileChange({
    state,
    project,
    type: 'agent.create',
    summary: `Create agent ${name}`,
    targetFile: path.join('.opencode', 'agents', `${name}.md`),
    afterContent: markdown,
    patch: input,
  });
}

export async function getAgent(projectId: string, agentName: string) {
  const agents = await listAgents(projectId);
  const agent = agents.find((item) => item.name === agentName);
  if (!agent) {
    throw new ApiError(404, 'AGENT_NOT_FOUND', 'Agent not found');
  }
  return agent;
}

export async function updateAgent(projectId: string, agentName: string, input: {
  description?: string;
  mode?: string;
  model?: string;
  temperature?: number;
  maxSteps?: number;
  disable?: boolean;
  tools?: Record<string, unknown>;
  permission?: Record<string, unknown>;
  taskPermission?: Record<string, unknown>;
  topP?: number;
  prompt?: string;
}) {
  const current = await getAgent(projectId, agentName);
  const markdown = buildAgentMarkdown({
    name: agentName,
    description: input.description ?? current.description,
    mode: input.mode ?? current.mode,
    model: input.model ?? current.model,
    temperature: input.temperature ?? current.temperature,
    maxSteps: input.maxSteps ?? current.maxSteps,
    disable: input.disable ?? current.disable,
    tools: input.tools ?? (current.tools && typeof current.tools === 'object' && !Array.isArray(current.tools) ? current.tools as Record<string, unknown> : undefined),
    permission: input.permission ?? (current.permission && typeof current.permission === 'object' && !Array.isArray(current.permission) ? current.permission as Record<string, unknown> : undefined),
    taskPermission: input.taskPermission ?? (current.taskPermission && typeof current.taskPermission === 'object' && !Array.isArray(current.taskPermission) ? current.taskPermission as Record<string, unknown> : undefined),
    topP: input.topP ?? current.topP,
    prompt: input.prompt ?? current.prompt,
  });
  const state = await loadState();
  const project = assertProject(state, projectId);
  const targetFile = current.filePath
    ? toProjectRelative(project, current.filePath)
    : path.join('.opencode', 'agents', `${sanitizeName(agentName, 'agent name')}.md`);
  return createFileChange({
    state,
    project,
    type: 'agent.update',
    summary: current.filePath ? `Update agent ${agentName}` : `Override built-in agent ${agentName}`,
    targetFile,
    afterContent: markdown,
    patch: input,
  });
}

export async function deleteAgent(projectId: string, agentName: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const agent = (await listAgents(projectId)).find((item) => item.name === agentName);
  if (!agent?.filePath) {
    throw new ApiError(403, 'BUILTIN_AGENT_READONLY', 'Only project/global agent files can be deleted');
  }
  const filePath = resolveProjectPath(project, toProjectRelative(project, agent.filePath));
  const beforeContent = await readText(filePath);
  const backupDir = path.join(getStateDirectory(), 'backups', project.id);
  await fs.mkdir(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `${new Date().toISOString().replace(/[:.]/g, '-')}-${path.basename(filePath)}.bak`);
  await fs.writeFile(backupPath, beforeContent, 'utf8');
  await fs.unlink(filePath);
  state.auditLogs.unshift({
    id: makeId('audit'),
    actor: 'local-user',
    action: 'delete',
    targetType: 'agent',
    targetId: agentName,
    metadata: { filePath: toProjectRelative(project, filePath), backupPath },
    createdAt: now(),
  });
  await saveState(state);
  await restartOpenCodeForProject(project);
}

export async function setDefaultAgent(projectId: string, agentName: string) {
  await getAgent(projectId, agentName);
  return createConfigPatchChange({
    projectId,
    type: 'agent.default',
    summary: `Set default agent to ${agentName}`,
    patch: { agent: agentName },
  });
}

export async function listTools(projectId: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const config = project.configPath ? await readJsonc(project.configPath).catch(() => ({})) : {};
  const mcp = isPlainObject((config as Record<string, unknown>).mcp) ? (config as Record<string, unknown>).mcp as Record<string, unknown> : {};
  const mcpTools = Object.keys(mcp).map((name) => ({
    name: `mcp:${name}`,
    source: 'mcp',
    description: `Tool exposed by MCP server ${name}`,
    riskLevel: 'medium' as RiskLevel,
  }));
  return [...BUILTIN_TOOLS, ...mcpTools];
}

function permissionsFromConfig(config: unknown) {
  const source = isPlainObject(config) ? config.permission ?? config.permissions : null;
  if (!isPlainObject(source)) return [];
  return Object.entries(source).map(([tool, value]) => {
    const effective = typeof value === 'string' ? value : JSON.stringify(value);
    return {
      tool,
      project: effective,
      global: 'not declared',
      effective,
      risk: riskFromContent('permission', tool, effective),
    };
  });
}

export async function getPermissions(projectId: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const config = project.configPath ? await readJsonc(project.configPath).catch(() => ({})) : {};
  return permissionsFromConfig(config);
}

export async function updatePermissions(projectId: string, input: { scope?: string; permission: Record<string, unknown> }) {
  if (!isPlainObject(input.permission)) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'permission object is required');
  }
  return createConfigPatchChange({
    projectId,
    type: 'permission.update',
    summary: 'Update tool permissions',
    patch: { permission: input.permission },
  });
}

async function scanSkills(project: ProjectRecord) {
  const skillRoots = [
    { scope: 'project', root: path.join(project.rootPath, '.opencode', 'skills') },
    { scope: 'project', root: path.join(project.rootPath, '.agents', 'skills') },
    { scope: 'global', root: path.join(os.homedir(), '.config', 'opencode', 'skills') },
    { scope: 'global', root: path.join(os.homedir(), '.agents', 'skills') },
  ];
  const skills = [];
  const seen = new Set<string>();

  for (const skillRoot of skillRoots) {
    if (!(await pathExists(skillRoot.root))) continue;
    const entries = await fs.readdir(skillRoot.root, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const sourcePath = path.join(skillRoot.root, entry.name);
      const skillFile = path.join(sourcePath, 'SKILL.md');
      if (!(await pathExists(skillFile)) || seen.has(skillFile)) continue;
      seen.add(skillFile);
      const content = await readText(skillFile, 20000).catch(() => '');
      const frontMatter = parseFrontMatter(content);
      const validation = validateSkillContent(content, entry.name);
      skills.push({
        id: stableId('skl', skillFile),
        name: readFrontMatterString(frontMatter, 'name', entry.name),
        description: readFrontMatterString(frontMatter, 'description', firstMarkdownParagraph(content) || 'No description.'),
        scope: skillRoot.scope,
        sourcePath: skillFile,
        status: validation.valid ? 'valid' : 'invalid',
        hash: `sha256:${sha256(content)}`,
        frontmatter: frontMatter,
        bodyPreview: removeFrontMatter(content).slice(0, 2000),
        validation,
      });
    }
  }
  return skills;
}

export async function listSkills(projectId: string, query: { scope?: string; q?: string; status?: string }) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  let skills = await scanSkills(project);
  for (const skill of skills) {
    const override = state.skillOverrides[skill.sourcePath];
    if (override?.status) {
      skill.status = override.status;
    }
  }
  if (query.scope && query.scope !== 'all') {
    skills = skills.filter((skill) => skill.scope === query.scope);
  }
  if (query.status) {
    skills = skills.filter((skill) => skill.status === query.status);
  }
  if (query.q) {
    const q = query.q.toLowerCase();
    skills = skills.filter((skill) => skill.name.toLowerCase().includes(q) || skill.description.toLowerCase().includes(q));
  }
  return skills;
}

export async function findExternalSkills(input: { skillName?: string }) {
  const skillName = input.skillName?.trim();
  if (!skillName) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'skillName is required');
  }
  if (skillName.length > 120) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'skillName must be 120 characters or fewer');
  }

  const command = ['npx', 'skills', 'find', skillName];
  const invocation = await skillsCliInvocation(['find', skillName]);
  try {
    const { stdout, stderr } = await execFileAsync(invocation.executable, invocation.args, {
      cwd: resolveWorkspaceRoot(),
      timeout: 30000,
      windowsHide: true,
      maxBuffer: 1024 * 1024,
    });
    const cleanStdout = stripAnsi(stdout).trim();
    const cleanStderr = stripAnsi(stderr).trim();
    return {
      query: skillName,
      command: command.join(' '),
      stdout: cleanStdout,
      stderr: cleanStderr,
      items: parseSkillFindResults(cleanStdout),
    };
  } catch (error) {
    const details = error && typeof error === 'object'
      ? {
        stdout: 'stdout' in error && typeof error.stdout === 'string' ? stripAnsi(error.stdout).trim() : '',
        stderr: 'stderr' in error && typeof error.stderr === 'string' ? stripAnsi(error.stderr).trim() : '',
      }
      : undefined;
    throw new ApiError(502, 'SKILL_FIND_FAILED', 'Unable to run npx skills find', details);
  }
}

async function skillsCliInvocation(args: string[]) {
  const appDataSkillsCli = process.env.APPDATA
    ? path.join(process.env.APPDATA, 'npm', 'node_modules', 'skills', 'bin', 'cli.mjs')
    : '';
  const executable = process.platform === 'win32' && appDataSkillsCli && await pathExists(appDataSkillsCli)
    ? process.execPath
    : 'npx';
  return {
    executable,
    args: executable === process.execPath ? [appDataSkillsCli, ...args] : ['skills', ...args],
  };
}

function parseSkillFindResults(stdout: string) {
  const lines = stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const items: Array<{ package: string; installs: string; url: string; name: string }> = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+@[A-Za-z0-9_.:-]+)\s+(.+ installs)$/);
    if (!match) continue;
    const urlLine = lines[index + 1]?.replace(/^└\s*/, '') ?? '';
    const packageId = match[1];
    items.push({
      package: packageId,
      installs: match[2],
      url: /^https?:\/\//i.test(urlLine) ? urlLine : '',
      name: packageId.split('@').at(-1) ?? packageId,
    });
  }
  return items;
}

export async function installGlobalSkill(input: { packageId?: string }) {
  const packageId = input.packageId?.trim();
  if (!packageId) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'packageId is required');
  }
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+@[A-Za-z0-9_.:-]+$/.test(packageId)) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'packageId must use owner/repo@skill format');
  }

  const invocation = await skillsCliInvocation(['add', packageId, '-g', '-y']);
  try {
    const { stdout, stderr } = await execFileAsync(invocation.executable, invocation.args, {
      cwd: resolveWorkspaceRoot(),
      timeout: 120000,
      windowsHide: true,
      maxBuffer: 1024 * 1024,
    });
    return {
      packageId,
      command: `npx skills add ${packageId} -g -y`,
      stdout: stripAnsi(stdout).trim(),
      stderr: stripAnsi(stderr).trim(),
    };
  } catch (error) {
    const details = error && typeof error === 'object'
      ? {
        stdout: 'stdout' in error && typeof error.stdout === 'string' ? stripAnsi(error.stdout).trim() : '',
        stderr: 'stderr' in error && typeof error.stderr === 'string' ? stripAnsi(error.stderr).trim() : '',
      }
      : undefined;
    throw new ApiError(502, 'SKILL_INSTALL_FAILED', 'Unable to install global skill', details);
  }
}

export function validateSkillContent(content: string, directoryName?: string) {
  const frontmatter = parseFrontMatter(content);
  const errors: Array<{ code: string; message: string }> = [];
  const warnings: Array<{ code: string; message: string }> = [];
  if (!content.trim()) {
    errors.push({ code: 'EMPTY_SKILL', message: 'SKILL.md content cannot be empty' });
  }
  if (!frontmatter.name) {
    errors.push({ code: 'NAME_REQUIRED', message: 'frontmatter.name is required' });
  } else if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(readFrontMatterString(frontmatter, 'name'))) {
    errors.push({ code: 'NAME_INVALID', message: 'frontmatter.name must use letters, numbers, hyphen or underscore' });
  }
  if (!frontmatter.description) {
    errors.push({ code: 'DESCRIPTION_REQUIRED', message: 'frontmatter.description is required' });
  }
  if (directoryName && frontmatter.name && directoryName !== readFrontMatterString(frontmatter, 'name')) {
    warnings.push({ code: 'DIRECTORY_NAME_MISMATCH', message: 'Directory name does not match skill name' });
  }
  if (content.length > 50000) {
    warnings.push({ code: 'LARGE_SKILL', message: 'Skill content is large; keep SKILL.md focused and lazy-load references' });
  }
  return {
    valid: errors.length === 0,
    frontmatter,
    errors,
    warnings,
  };
}

export async function getSkill(projectId: string, skillName: string) {
  const skills = await listSkills(projectId, { scope: 'all' });
  const skill = skills.find((item) => item.name === skillName || path.basename(path.dirname(item.sourcePath)) === skillName);
  if (!skill) {
    throw new ApiError(404, 'SKILL_NOT_FOUND', 'Skill not found');
  }
  const content = await readText(skill.sourcePath, 40000);
  const validation = validateSkillContent(content, path.basename(path.dirname(skill.sourcePath)));
  return {
    name: skill.name,
    frontmatter: validation.frontmatter,
    bodyPreview: removeFrontMatter(content).slice(0, 8000),
    validation,
    sourcePath: skill.sourcePath,
  };
}

export async function validateSkill(input: { content: string; directoryName?: string }) {
  return validateSkillContent(input.content, input.directoryName);
}

export async function importSkill(projectId: string, input: { scope?: string; directoryName: string; content: string }) {
  const directoryName = sanitizeName(input.directoryName, 'directoryName');
  const validation = validateSkillContent(input.content, directoryName);
  if (!validation.valid) {
    throw new ApiError(422, 'SKILL_INVALID', 'Skill content is invalid', validation.errors);
  }
  const state = await loadState();
  const project = assertProject(state, projectId);
  return createFileChange({
    state,
    project,
    type: 'skill.import',
    summary: `Import skill ${directoryName}`,
    targetFile: path.join('.opencode', 'skills', directoryName, 'SKILL.md'),
    afterContent: input.content.endsWith('\n') ? input.content : `${input.content}\n`,
    patch: input,
  });
}

export async function updateSkillStatus(projectId: string, skillName: string, input: { status: string }) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const skill = await getSkill(projectId, skillName);
  state.skillOverrides[skill.sourcePath] = { status: input.status };
  state.auditLogs.unshift({
    id: makeId('audit'),
    actor: 'local-user',
    action: 'update',
    targetType: 'skill',
    targetId: skillName,
    metadata: { status: input.status },
    createdAt: now(),
  });
  await saveState(state);
  await restartOpenCodeForProject(project);
  return { name: skillName, status: input.status };
}

export async function deleteSkill(projectId: string, skillName: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const skill = await getSkill(projectId, skillName);
  const skillDir = path.dirname(skill.sourcePath);
  const removableRoot = findRemovableSkillRoot(project, skillDir);
  if (!removableRoot) {
    throw new ApiError(403, 'DELETE_SCOPE_BLOCKED', 'Only project skills and user global skills can be deleted');
  }
  const backupDir = path.join(getStateDirectory(), 'backups', project.id, `${skillName}-${Date.now()}`);
  await fs.mkdir(backupDir, { recursive: true });
  await fs.cp(skillDir, backupDir, { recursive: true });
  await fs.rm(skillDir, { recursive: true, force: true });
  delete state.skillOverrides[skill.sourcePath];
  state.auditLogs.unshift({
    id: makeId('audit'),
    actor: 'local-user',
    action: 'delete',
    targetType: 'skill',
    targetId: skillName,
    metadata: { backupPath: backupDir, sourcePath: skill.sourcePath, removableRoot },
    createdAt: now(),
  });
  await saveState(state);
  await restartOpenCodeForProject(project);
}

export async function searchMarketplace(query: { q?: string; source?: string; trustLevel?: string; page?: number; pageSize?: number }) {
  const state = await loadState();
  const project = assertProject(state);
  const localCandidates = (await scanSkills(project))
    .filter((skill) => skill.scope === 'global')
    .map<MarketplaceSkillRecord>((skill) => ({
      id: stableId('mkt', skill.sourcePath),
      name: skill.name,
      description: skill.description,
      sourceUrl: skill.sourcePath,
      trustLevel: 'community',
      cachedAt: now(),
    }));

  const all = [...state.marketplaceSkills, ...localCandidates];
  const q = query.q?.trim().toLowerCase();
  let filtered = q ? all.filter((item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) : all;
  if (query.trustLevel) filtered = filtered.filter((item) => item.trustLevel === query.trustLevel);
  return responsePage(filtered, query.page, query.pageSize);
}

export async function previewMarketplaceSkill(marketplaceSkillId: string) {
  const state = await loadState();
  const project = assertProject(state);
  const candidates = (await searchMarketplace({ pageSize: 200 })).data;
  const item = candidates.find((candidate) => candidate.id === marketplaceSkillId);
  if (!item) {
    throw new ApiError(404, 'MARKETPLACE_SKILL_NOT_FOUND', 'Marketplace skill not found');
  }

  let content = item.content ?? '';
  if (!content && /^https?:\/\//i.test(item.sourceUrl)) {
    const response = await fetch(item.sourceUrl, { signal: AbortSignal.timeout(5000) });
    content = await response.text();
  } else if (!content) {
    const sourcePath = path.isAbsolute(item.sourceUrl) ? item.sourceUrl : resolveProjectPath(project, item.sourceUrl);
    content = await readText(sourcePath, 40000);
  }

  return {
    ...item,
    content,
    validation: validateSkillContent(content, item.name),
  };
}

export async function installMarketplaceSkill(projectId: string, input: { marketplaceSkillId: string; scope?: string; directoryName?: string }) {
  const preview = await previewMarketplaceSkill(input.marketplaceSkillId);
  const directoryName = sanitizeName(input.directoryName ?? preview.name, 'directoryName');
  return importSkill(projectId, { scope: input.scope ?? 'project', directoryName, content: preview.content });
}

export async function refreshMarketplace(input: { source?: string; force?: boolean }) {
  const state = await loadState();
  state.auditLogs.unshift({
    id: makeId('audit'),
    actor: 'local-user',
    action: 'refresh',
    targetType: 'marketplace',
    metadata: { source: input.source ?? 'all', force: !!input.force },
    createdAt: now(),
  });
  await saveState(state);
  return { refreshed: true, cachedAt: now() };
}

function mcpEntries(config: unknown) {
  const source = isPlainObject(config) ? config.mcp ?? config.mcpServers : null;
  if (!isPlainObject(source)) return [];
  return Object.entries(source).map(([name, value]) => {
    const item = isPlainObject(value) ? value : {};
    const type = String(item.type || item.transport || (item.url ? 'remote' : 'local'));
    return {
      name,
      type,
      transport: String(item.transport || item.type || (item.command ? 'stdio' : 'remote')),
      url: typeof item.url === 'string' ? item.url : undefined,
      command: item.command,
      enabled: item.enabled !== false,
      status: item.enabled === false ? 'disabled' : 'unknown',
      riskLevel: item.url || type === 'remote' ? 'high' as RiskLevel : 'medium' as RiskLevel,
    };
  });
}

type McpMarketplaceEntry = {
  id: string;
  name: string;
  description: string;
  url: string;
  packageIdentifier?: string;
  registryType?: string;
  installName: string;
  source: string;
  transport: string;
  apiKeyEnvVar: string;
  apiKeyHeader: string;
  apiKeyHeaderTemplate: string;
  installable: boolean;
  risk: RiskLevel;
};

const MCP_MARKETPLACE: McpMarketplaceEntry[] = [
  {
    id: 'context7',
    name: 'Context7',
    description: 'Search up-to-date library documentation from prompts.',
    url: 'https://mcp.context7.com/mcp',
    installName: 'context7',
    source: 'curated',
    transport: 'remote',
    apiKeyEnvVar: 'CONTEXT7_API_KEY',
    apiKeyHeader: 'CONTEXT7_API_KEY',
    apiKeyHeaderTemplate: '{env:CONTEXT7_API_KEY}',
    installable: true,
    risk: 'high' as RiskLevel,
  },
  {
    id: 'grep',
    name: 'Grep by Vercel',
    description: 'Search code snippets and public repositories through grep.app.',
    url: 'https://mcp.grep.app',
    installName: 'grep',
    source: 'curated',
    transport: 'remote',
    apiKeyEnvVar: 'GREP_API_KEY',
    apiKeyHeader: 'Authorization',
    apiKeyHeaderTemplate: 'Bearer {env:GREP_API_KEY}',
    installable: true,
    risk: 'high' as RiskLevel,
  },
  {
    id: 'custom-remote',
    name: 'Custom Remote MCP',
    description: 'Connect a remote MCP endpoint that only needs a URL and API key.',
    url: 'https://example.com/mcp',
    installName: 'custom-remote',
    source: 'curated',
    transport: 'remote',
    apiKeyEnvVar: 'CUSTOM_MCP_API_KEY',
    apiKeyHeader: 'Authorization',
    apiKeyHeaderTemplate: 'Bearer {env:CUSTOM_MCP_API_KEY}',
    installable: true,
    risk: 'high' as RiskLevel,
  },
];

const MCP_REGISTRY_BASE_URL = 'https://registry.modelcontextprotocol.io';
const MCP_REGISTRY_CACHE_TTL_MS = 5 * 60 * 1000;
const mcpRegistryCache = new Map<string, { expiresAt: number; items: Array<Record<string, unknown>> }>();

export async function listMcpServers(projectId: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const config = project.configPath ? await readJsonc(project.configPath).catch(() => ({})) : {};
  return mcpEntries(config);
}

function textMatches(item: { id: string; name: string; description: string; url?: string; packageIdentifier?: string }, query?: string) {
  const normalized = query?.trim().toLowerCase();
  if (!normalized) return true;
  return [item.id, item.name, item.description, item.url, item.packageIdentifier]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(normalized);
}

function registryInstallName(serverName: string) {
  const raw = (serverName.split('/').pop() || serverName).replace(/^mcp[-_]?/i, '').replace(/[-_]?mcp$/i, '') || serverName;
  const normalized = raw.replace(/[^A-Za-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  return /^[A-Za-z0-9]/.test(normalized) ? normalized.slice(0, 64) : `mcp-${stableId('', serverName).replace(/^_/, '')}`;
}

function firstString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function mapRegistryServer(entry: Record<string, unknown>) {
  const server = isPlainObject(entry.server) ? entry.server as Record<string, unknown> : entry;
  const name = firstString(server.name);
  if (!name) return null;
  const remotes = Array.isArray(server.remotes) ? server.remotes.filter(isPlainObject) as Array<Record<string, unknown>> : [];
  const packages = Array.isArray(server.packages) ? server.packages.filter(isPlainObject) as Array<Record<string, unknown>> : [];
  const remote = remotes.find((item) => typeof item.url === 'string' && /^https?:\/\//i.test(item.url));
  const pkg = packages.find((item) => typeof item.identifier === 'string');
  const packageIdentifier = firstString(pkg?.identifier);
  const registryType = firstString(pkg?.registryType);
  const title = firstString(server.title);
  const description = firstString(server.description) || 'MCP server from the official registry.';
  const url = firstString(remote?.url);
  const transport = url ? 'remote' : packageIdentifier ? 'local' : 'unknown';

  return {
    id: name,
    name: title || name,
    description,
    url,
    packageIdentifier,
    registryType,
    installName: registryInstallName(name),
    source: 'official-registry',
    transport,
    apiKeyEnvVar: '',
    apiKeyHeader: '',
    apiKeyHeaderTemplate: '',
    installable: !!url || registryType === 'npm',
    risk: url ? 'high' as RiskLevel : 'medium' as RiskLevel,
  };
}

async function fetchMcpRegistry(search: string, limit: number) {
  const params = new URLSearchParams({
    limit: String(limit),
    version: 'latest',
  });
  if (search.trim()) params.set('search', search.trim());
  const url = `${MCP_REGISTRY_BASE_URL}/v0.1/servers?${params.toString()}`;
  const cached = mcpRegistryCache.get(url);
  if (cached && cached.expiresAt > Date.now()) return cached.items;

  const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) {
    throw new ApiError(502, 'MCP_REGISTRY_FAILED', `Official MCP Registry returned HTTP ${response.status}`);
  }
  const body = await response.json() as { servers?: unknown };
  const items = Array.isArray(body.servers) ? body.servers.filter(isPlainObject) as Array<Record<string, unknown>> : [];
  mcpRegistryCache.set(url, { expiresAt: Date.now() + MCP_REGISTRY_CACHE_TTL_MS, items });
  return items;
}

async function searchOfficialMcpRegistry(query: { q?: string; limit?: number }) {
  const q = query.q?.trim() ?? '';
  const limit = Math.min(Math.max(Number(query.limit) || 24, 1), 60);
  const searchTerms = q ? [q] : [''];
  const pages = await Promise.all(searchTerms.map((term) => fetchMcpRegistry(term, limit)));
  const mapped = pages
    .flat()
    .map(mapRegistryServer)
    .filter((item): item is NonNullable<ReturnType<typeof mapRegistryServer>> => !!item);
  const unique = new Map<string, NonNullable<ReturnType<typeof mapRegistryServer>>>();
  for (const item of mapped) {
    if (!unique.has(item.id)) unique.set(item.id, item);
  }
  return Array.from(unique.values())
    .filter((item) => textMatches(item, q))
    .slice(0, limit);
}

export async function listMcpMarketplace(query: { q?: string; limit?: number } = {}) {
  const q = query.q?.trim() ?? '';
  const curated = MCP_MARKETPLACE
    .filter((item) => textMatches(item, q));
  let registry: Awaited<ReturnType<typeof searchOfficialMcpRegistry>> = [];
  try {
    registry = await searchOfficialMcpRegistry(query);
  } catch {
    registry = [];
  }
  const seen = new Set<string>();
  return [...curated, ...registry]
    .filter((item) => {
      const key = item.id.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, Math.min(Math.max(Number(query.limit) || 24, 1), 60));
}

async function resolveMcpMarketplaceItem(id: string) {
  const item = MCP_MARKETPLACE.find((candidate) => candidate.id === id);
  if (item) return item;

  const encodedName = encodeURIComponent(id);
  const response = await fetch(`${MCP_REGISTRY_BASE_URL}/v0.1/servers/${encodedName}/versions/latest`, { signal: AbortSignal.timeout(12000) });
  if (response.ok) {
    const body = await response.json() as Record<string, unknown>;
    const mapped = mapRegistryServer(body);
    if (mapped) return mapped;
  }
  throw new ApiError(404, 'MCP_MARKETPLACE_NOT_FOUND', 'MCP marketplace item not found');
}

function envNameFromInput(value: unknown, fallback: string) {
  const raw = typeof value === 'string' && value.trim() ? value.trim() : fallback;
  const normalized = raw.toUpperCase().replace(/[^A-Z0-9_]/g, '_').replace(/^_+|_+$/g, '');
  if (!/^[A-Z_][A-Z0-9_]{1,80}$/.test(normalized)) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'API key env name must be a valid environment variable name');
  }
  return normalized;
}

function replaceEnvRef(template: string, envName: string) {
  return template.replace(/\{env:[^}]+\}/g, `{env:${envName}}`);
}

async function getOpenCodeMcpStatus(connection?: ServerConnectionRecord) {
  await ensureOpenCodeServer(connection);
  return openCodeJson<Record<string, unknown>>('/mcp', { method: 'GET' }, connection, 10000);
}

export async function checkMcpServers(projectId: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);
  const health = await ensureOpenCodeServer(connection);
  const status = await getOpenCodeMcpStatus(connection);
  return { health, status };
}

export async function installMcpMarketplaceServer(projectId: string, input: {
  marketplaceId?: string;
  name?: string;
  url?: string;
  apiKey?: string;
  apiKeyEnvVar?: string;
}) {
  const item = await resolveMcpMarketplaceItem(String(input.marketplaceId ?? ''));
  const name = sanitizeName(String(input.name ?? item.id), 'MCP name');
  const url = typeof input.url === 'string' && input.url.trim() ? input.url.trim() : item.url;
  if (url && !/^https?:\/\//i.test(url)) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Remote MCP url must be http(s)');
  }

  const needsApiKeyHeader = !!(item.apiKeyHeader && item.apiKeyHeaderTemplate);
  const envName = needsApiKeyHeader ? envNameFromInput(input.apiKeyEnvVar, item.apiKeyEnvVar) : '';
  if (needsApiKeyHeader && typeof input.apiKey === 'string' && input.apiKey.trim()) {
    process.env[envName] = input.apiKey.trim();
  }

  const headers = needsApiKeyHeader
    ? { [item.apiKeyHeader]: replaceEnvRef(item.apiKeyHeaderTemplate, envName) }
    : undefined;
  const config = url
    ? removeUndefinedKeys({
      type: 'remote',
      url,
      enabled: true,
      headers,
    })
    : item.registryType === 'npm' && item.packageIdentifier
      ? {
        type: 'local',
        command: ['npx', '-y', item.packageIdentifier],
        enabled: true,
      }
      : null;
  if (!config) {
    throw new ApiError(422, 'MCP_INSTALL_UNSUPPORTED', 'This MCP registry item does not expose a remote URL or npm package that can be installed automatically');
  }

  const change = await createConfigPatchChange({
    projectId,
    type: 'mcp.install',
    summary: `Install MCP server ${name}`,
    targetFile: 'opencode.json',
    patch: { mcp: { [name]: config } },
  });
  const applyResult = await applyConfigChange(change.id, { confirmed: true, confirmationText: 'I understand the risk' });

  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);
  let runtimeStatus: Record<string, unknown> | null = null;
  let runtimeError: string | null = null;
  try {
    await ensureOpenCodeServer(connection);
    const runtimeConfig = url && needsApiKeyHeader && typeof input.apiKey === 'string' && input.apiKey.trim()
      ? { ...config, headers: { [item.apiKeyHeader]: item.apiKeyHeaderTemplate.startsWith('Bearer ') ? `Bearer ${input.apiKey.trim()}` : input.apiKey.trim() } }
      : config;
    await openCodeJson(`/mcp`, {
      method: 'POST',
      body: JSON.stringify({ name, config: runtimeConfig }),
    }, connection, 15000);
    runtimeStatus = await getOpenCodeMcpStatus(connection);
  } catch (error) {
    runtimeError = error instanceof Error ? error.message : 'Unable to check OpenCode MCP status';
  }

  return {
    change,
    applyResult,
    server: {
      name,
      config,
    },
    runtimeStatus,
    runtimeError,
  };
}

export async function createMcpServer(projectId: string, input: Record<string, unknown>) {
  const name = sanitizeName(String(input.name ?? ''), 'MCP name');
  if (input.url && typeof input.url === 'string' && !/^https?:\/\//i.test(input.url)) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Remote MCP url must be http(s)');
  }
  if (isPlainObject(input.headers) && Object.values(input.headers).some((value) => typeof value === 'string' && SECRET_NAME_PATTERN.test(value) && !/^\{(env|file):[^}]+\}$/.test(value))) {
    throw new ApiError(403, 'SECRET_PLAINTEXT_BLOCKED', 'MCP headers must use env/file references for secrets');
  }
  const { name: _discard, ...config } = input;
  return createConfigPatchChange({
    projectId,
    type: 'mcp.create',
    summary: `Create MCP server ${name}`,
    patch: { mcp: { [name]: config } },
  });
}

export async function testMcpServer(projectId: string, name: string) {
  const server = (await listMcpServers(projectId)).find((item) => item.name === name);
  if (!server) {
    throw new ApiError(404, 'MCP_NOT_FOUND', 'MCP server not found');
  }
  if (!server.enabled) {
    return { name, status: 'disabled', latencyMs: null };
  }
  if (server.url) {
    const startedAt = Date.now();
    try {
      const response = await fetch(server.url, { signal: AbortSignal.timeout(2500) });
      return { name, status: response.ok ? 'connected' : `http_${response.status}`, latencyMs: Date.now() - startedAt };
    } catch {
      return { name, status: 'failed', latencyMs: Date.now() - startedAt };
    }
  }
  return { name, status: 'not_tested', latencyMs: null };
}

export async function updateMcpServer(projectId: string, name: string, input: Record<string, unknown>) {
  sanitizeName(name, 'MCP name');
  return createConfigPatchChange({
    projectId,
    type: 'mcp.update',
    summary: `Update MCP server ${name}`,
    patch: { mcp: { [name]: input } },
  });
}

export async function deleteMcpServer(projectId: string, name: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  sanitizeName(name, 'MCP name');
  const targetFile = project.configPath ? toProjectRelative(project, project.configPath) : 'opencode.json';
  const targetPath = resolveProjectPath(project, targetFile, { allowMissing: true });
  const config = await readJsonc(targetPath).catch(() => ({}));

  if (!isPlainObject(config)) {
    throw new ApiError(422, 'CONFIG_INVALID', 'OpenCode config must be an object');
  }

  const configRecord = config as Record<string, unknown>;
  const mcpSource = isPlainObject(configRecord.mcp)
    ? configRecord.mcp as Record<string, unknown>
    : isPlainObject(configRecord.mcpServers)
      ? configRecord.mcpServers as Record<string, unknown>
      : null;
  const mcpKey = isPlainObject(configRecord.mcp) ? 'mcp' : isPlainObject(configRecord.mcpServers) ? 'mcpServers' : 'mcp';

  if (!mcpSource || !(name in mcpSource)) {
    throw new ApiError(404, 'MCP_NOT_FOUND', 'MCP server not found in opencode.json');
  }

  const backupDir = path.join(getStateDirectory(), 'backups', project.id, `mcp-${name}-${Date.now()}`);
  await fs.mkdir(backupDir, { recursive: true });
  if (await pathExists(targetPath)) {
    await fs.copyFile(targetPath, path.join(backupDir, path.basename(targetPath)));
  }

  deleteNestedKey(configRecord, [mcpKey, name]);
  if (isPlainObject(configRecord[mcpKey]) && Object.keys(configRecord[mcpKey] as Record<string, unknown>).length === 0) {
    delete configRecord[mcpKey];
  }

  await writeAtomic(targetPath, stringifyConfig(configRecord));
  state.auditLogs.unshift({
    id: makeId('audit'),
    actor: 'local-user',
    action: 'delete',
    targetType: 'mcp',
    targetId: name,
    metadata: { configPath: targetPath, backupPath: backupDir },
    createdAt: now(),
  });
  await saveState(state);
  const openCodeRestart = await restartOpenCodeForProject(project);

  return {
    name,
    removed: true,
    configPath: targetPath,
    backupPath: backupDir,
    openCodeRestart,
  };
}

async function scanCommands(project: ProjectRecord) {
  const commandRoots = [
    path.join(project.rootPath, '.opencode', 'commands'),
    path.join(project.rootPath, '.agents', 'commands'),
    path.join(os.homedir(), '.config', 'opencode', 'commands'),
  ];
  const commands = [];
  for (const commandRoot of commandRoots) {
    if (!(await pathExists(commandRoot))) continue;
    const entries = await fs.readdir(commandRoot, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== '.md') continue;
      const sourcePath = path.join(commandRoot, entry.name);
      const content = await readText(sourcePath, 16000).catch(() => '');
      const frontMatter = parseFrontMatter(content);
      const source = sourcePath.startsWith(project.rootPath) ? 'project' : 'global';
      commands.push({
        name: path.basename(entry.name, '.md'),
        description: readFrontMatterString(frontMatter, 'description', firstMarkdownParagraph(content) || 'No description.'),
        agent: readFrontMatterString(frontMatter, 'agent') || undefined,
        model: readFrontMatterString(frontMatter, 'model') || undefined,
        sourcePath,
        preview: content.slice(0, 2000),
        source,
        builtIn: false,
        frontmatter: frontMatter,
        template: removeFrontMatter(content).trim(),
      });
    }
  }
  return commands;
}

async function listOpenCodeCommands(connection?: ServerConnectionRecord) {
  try {
    await ensureOpenCodeServer(connection);
    const commands = await openCodeJson<Array<Record<string, unknown>>>('/command', { method: 'GET' }, connection, 10000);
    return mapOpenCodeCommandRecords(commands);
  } catch {
    return FALLBACK_BUILTIN_COMMANDS.map((command) => ({
      ...command,
      agent: undefined,
      model: undefined,
      sourcePath: `builtin:/${command.name}`,
      preview: command.template,
      source: 'builtin',
      builtIn: true,
      frontmatter: {},
    }));
  }
}

export function mapOpenCodeCommandRecords(commands: Array<Record<string, unknown>>) {
  return commands
    .map((command) => {
      const name = String(command.name ?? '').trim();
      const source = String(command.source ?? 'builtin').trim() || 'builtin';
      return {
        name,
        description: typeof command.description === 'string' ? command.description : 'OpenCode command.',
        agent: typeof command.agent === 'string' ? command.agent : undefined,
        model: typeof command.model === 'string' ? command.model : undefined,
        sourcePath: `${source}:/${name}`,
        preview: typeof command.template === 'string' ? command.template.slice(0, 2000) : '',
        source,
        builtIn: true,
        frontmatter: {},
        template: typeof command.template === 'string' ? command.template : '',
      };
    })
    .filter((command) => command.name);
}

export async function listCommands(projectId: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);
  const [builtIns, fileCommands] = await Promise.all([
    listOpenCodeCommands(connection),
    scanCommands(project),
  ]);
  const fileNames = new Set(fileCommands.map((command) => command.name));
  return [...builtIns.filter((command) => !fileNames.has(command.name)), ...fileCommands]
    .sort((left, right) => {
      if (left.builtIn !== right.builtIn) return left.builtIn ? -1 : 1;
      return left.name.localeCompare(right.name);
    });
}

function buildCommandMarkdown(input: { name: string; description?: string; agent?: string; model?: string; template: string }) {
  const name = sanitizeName(input.name, 'command name');
  return [
    '---',
    `description: "${(input.description ?? `${name} command`).replace(/"/g, '\\"')}"`,
    input.agent ? `agent: ${input.agent}` : '',
    input.model ? `model: ${input.model}` : '',
    '---',
    '',
    input.template.trim(),
    '',
  ].filter((line) => line !== '').join('\n');
}

export async function createCommand(projectId: string, input: { name: string; description?: string; agent?: string; model?: string; template: string }) {
  const name = sanitizeName(input.name, 'command name');
  if (!input.template?.trim()) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'template is required');
  }
  const state = await loadState();
  const project = assertProject(state, projectId);
  const targetPath = path.join(project.rootPath, '.opencode', 'commands', `${name}.md`);
  if (await pathExists(targetPath)) {
    throw new ApiError(409, 'COMMAND_ALREADY_EXISTS', 'Command already exists');
  }
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await writeAtomic(targetPath, buildCommandMarkdown(input));
  state.auditLogs.unshift({
    id: makeId('audit'),
    actor: 'local-user',
    action: 'create',
    targetType: 'command',
    targetId: `.opencode/commands/${name}.md`,
    metadata: { agent: input.agent, model: input.model },
    createdAt: now(),
  });
  await saveState(state);
  return getCommand(projectId, name);
}

export async function previewCommandCreate(projectId: string, input: { name: string; description?: string; agent?: string; model?: string; template: string }) {
  const name = sanitizeName(input.name, 'command name');
  const state = await loadState();
  const project = assertProject(state, projectId);
  return createFileChange({
    state,
    project,
    type: 'command.create',
    summary: `Create command ${name}`,
    targetFile: path.join('.opencode', 'commands', `${name}.md`),
    afterContent: buildCommandMarkdown(input),
    patch: input,
  });
}

export async function getCommand(projectId: string, name: string) {
  sanitizeName(name, 'command name');
  const command = (await listCommands(projectId)).find((item) => item.name === name);
  if (!command) {
    throw new ApiError(404, 'COMMAND_NOT_FOUND', 'Command not found');
  }
  return command;
}

export async function deleteCommand(projectId: string, name: string) {
  sanitizeName(name, 'command name');
  const state = await loadState();
  const project = assertProject(state, projectId);
  const targetPath = path.join(project.rootPath, '.opencode', 'commands', `${name}.md`);
  if (!(await pathExists(targetPath))) {
    throw new ApiError(403, 'COMMAND_DELETE_BLOCKED', 'Only project .opencode commands can be removed');
  }
  await fs.rm(targetPath, { force: true });
  state.auditLogs.unshift({
    id: makeId('audit'),
    actor: 'local-user',
    action: 'delete',
    targetType: 'command',
    targetId: `.opencode/commands/${name}.md`,
    metadata: {},
    createdAt: now(),
  });
  await saveState(state);
}

export function previewCommandTemplate(input: { template: string; arguments?: string[] }) {
  const args = input.arguments ?? [];
  let rendered = input.template;
  args.forEach((value, index) => {
    rendered = rendered.replaceAll(`$${index + 1}`, value).replaceAll(`{${index}}`, value);
  });
  return { rendered };
}

export async function parseConfigIntent(input: { projectId?: string; message: string }) {
  const state = await loadState();
  const project = assertProject(state, input.projectId);
  const message = input.message.trim();
  const lower = message.toLowerCase();
  let change: ConfigChangeRecord | null = null;
  let intent = 'unknown';
  let confidence = 0.4;
  const missingFields: string[] = [];
  let proposal: Record<string, unknown> = {};

  if (lower.includes('agent')) {
    intent = 'agent.create';
    confidence = 0.82;
    const matchedName = lower.match(/agent\s+([a-z0-9_-]+)/)?.[1] ?? 'review';
    const permission = lower.includes('read') || lower.includes('doc') || lower.includes('review')
      ? { read: 'allow', grep: 'allow', glob: 'allow', edit: 'deny', bash: 'deny' }
      : { read: 'allow', grep: 'allow', glob: 'allow', edit: 'ask', bash: 'ask' };
    change = await createAgent(project.id, {
      name: matchedName,
      description: `Generated from chat intent: ${message.slice(0, 80)}`,
      mode: 'subagent',
      permission,
      prompt: `User intent:\n${message}\n\nFollow this role while respecting project instructions.`,
    });
    proposal = { name: matchedName, mode: 'subagent', permission };
  } else if (lower.includes('permission') || lower.includes('bash') || lower.includes('edit') || lower.includes('write') || lower.includes('skill')) {
    intent = 'permission.update';
    confidence = 0.76;
    const tool = ['bash', 'edit', 'write', 'skill', 'read', 'grep', 'glob'].find((candidate) => lower.includes(candidate)) ?? 'bash';
    const value = ['allow', 'ask', 'deny'].find((candidate) => lower.includes(candidate)) ?? 'ask';
    change = await updatePermissions(project.id, { permission: { [tool]: value } });
    proposal = { permission: { [tool]: value } };
  } else if (lower.includes('mcp')) {
    intent = 'mcp.create';
    confidence = 0.62;
    const matchedName = lower.match(/mcp\s+([a-z0-9_-]+)/)?.[1] ?? 'context7';
    change = await createMcpServer(project.id, { name: matchedName, type: 'remote', enabled: false, url: 'https://example.com/mcp' });
    proposal = { name: matchedName, type: 'remote', enabled: false };
  } else if (lower.includes('skill')) {
    intent = 'skill.search';
    confidence = 0.58;
    missingFields.push('marketplaceSkillId');
    proposal = { action: 'search marketplace', query: message };
  } else {
    missingFields.push('intent');
  }

  return {
    intent,
    confidence,
    missingFields,
    configChangeId: change?.id,
    proposal,
    diff: change?.diff,
  };
}

function hasConfigMutationIntent(message: string) {
  const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const targetPattern = /(agent|permission|quyen|mcp|skill|config|tool|bash|edit|write)/i;
  const actionPattern = /(create|add|update|delete|enable|disable|set|allow|deny|install|import|tao|them|cap nhat|sua|xoa|bat|tat|cho phep|chan)/i;
  return targetPattern.test(lower) && actionPattern.test(lower);
}

function parseOpenCodeModel(model?: string) {
  if (!model) return undefined;
  const [providerID, ...modelParts] = model.split('/');
  const modelID = modelParts.join('/');
  if (!providerID || !modelID) return undefined;
  return { providerID, modelID };
}

function partText(part: OpenCodePart) {
  if (typeof part.text === 'string') return part.text;
  if (typeof part.content === 'string') return part.content;
  if (Array.isArray(part.content)) {
    return part.content
      .map((item) => isPlainObject(item) && typeof item.text === 'string' ? item.text : '')
      .filter(Boolean)
      .join('\n');
  }
  return '';
}

function extractOpenCodeText(parts?: OpenCodePart[], types?: string[]) {
  if (!Array.isArray(parts)) return '';
  return parts
    .map((part) => {
      if (types && !types.includes(typeof part.type === 'string' ? part.type : '')) {
        return '';
      }
      return partText(part);
    })
    .filter(Boolean)
    .join('\n')
    .trim();
}

function extractOpenCodeMainText(parts?: OpenCodePart[]) {
  return extractOpenCodeText(parts, ['text']) || extractOpenCodeText(parts);
}

function normalizeOpenCodeParts(parts?: OpenCodePart[]) {
  if (!Array.isArray(parts)) return undefined;
  return parts.map((part) => ({
    ...part,
    text: partText(part),
  }));
}

function hasOpenCodePartText(parts: ChatMessageRecord['parts'] | undefined, type: string) {
  return Array.isArray(parts) && parts.some((part) => part.type === type && typeof part.text === 'string' && part.text.trim().length > 0);
}

type ChatContextReferenceInput = {
  path?: string;
  name?: string;
  mime?: string;
  type?: 'file' | 'directory';
};

type NormalizedChatReference = {
  absolutePath: string;
  relativePath: string;
  type: 'file' | 'directory';
  name: string;
  mime?: string;
};

type ChatRequestOptions = {
  agent?: string;
  model?: string;
  command?: string;
  arguments?: string;
  skills?: string[];
  references?: ChatContextReferenceInput[];
  files?: ChatContextReferenceInput[];
  signal?: AbortSignal;
};

type OpenCodeSessionRecord = OpenCodeSessionResponse & {
  projectID?: string;
  agent?: string;
  model?: {
    id?: string;
    providerID?: string;
  };
  time?: {
    created?: number;
    updated?: number;
    archived?: number;
  };
};

type OpenCodeMessageEnvelope = OpenCodeMessageResponse & {
  info?: {
    id?: string;
    sessionID?: string;
    role?: string;
    time?: {
      created?: number;
    };
  };
};

type SnapshotFileDiff = {
  file?: string;
  patch?: string;
  additions?: number;
  deletions?: number;
  status?: 'added' | 'deleted' | 'modified' | string;
};

type ChatTurnBackup = {
  backupRoot: string;
  createdAt: string;
  sessionId: string;
  messageId: string;
  files: Array<{
    id: string;
    filePath: string;
    status: string;
    additions: number;
    deletions: number;
    currentBackupPath: string;
    headBackupPath: string;
    patchBackupPath: string;
  }>;
};

type ChatTurnBackupFailure = {
  code?: string;
  message: string;
};

function toIsoTimestamp(timestamp?: number) {
  return timestamp ? new Date(timestamp).toISOString() : now();
}

function formatSessionModel(model: OpenCodeSessionRecord['model']) {
  if (!model) return undefined;
  if (model.providerID && model.id) return `${model.providerID}/${model.id}`;
  return model.id;
}

function mapOpenCodeSession(project: ProjectRecord, session: OpenCodeSessionRecord): ChatSessionRecord {
  return {
    id: session.id ?? makeId('sess'),
    projectId: project.id,
    openCodeSessionId: session.id,
    title: session.title ?? 'Untitled session',
    agent: session.agent,
    model: formatSessionModel(session.model),
    skills: [],
    mcps: [],
    status: session.time?.archived ? 'archived' : 'active',
    createdAt: toIsoTimestamp(session.time?.created),
    updatedAt: toIsoTimestamp(session.time?.updated),
  };
}

function mapOpenCodeMessage(message: OpenCodeMessageEnvelope, fallbackSessionId: string): ChatMessageRecord | null {
  const role = message.info?.role;
  if (role !== 'user' && role !== 'assistant' && role !== 'system') {
    return null;
  }
  return {
    id: message.info?.id ?? makeId('msg'),
    sessionId: message.info?.sessionID ?? fallbackSessionId,
    role,
    content: role === 'assistant' ? extractOpenCodeMainText(message.parts) : extractOpenCodeText(message.parts),
    parts: normalizeOpenCodeParts(message.parts),
    createdAt: toIsoTimestamp(message.info?.time?.created),
  };
}

async function createOpenCodeSession(title: string, connection?: ServerConnectionRecord) {
  await ensureOpenCodeServer(connection);
  const session = await openCodeJson<OpenCodeSessionRecord>('/session', {
    method: 'POST',
    body: JSON.stringify({ title }),
  }, connection);
  if (!session.id) {
    throw new ApiError(502, 'OPENCODE_SESSION_FAILED', 'OpenCode did not return a session id.');
  }
  return session;
}

function mimeForPath(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.md') return 'text/markdown';
  if (extension === '.json' || extension === '.jsonc') return 'application/json';
  if (extension === '.ts' || extension === '.tsx') return 'text/typescript';
  if (extension === '.js' || extension === '.jsx' || extension === '.mjs' || extension === '.cjs') return 'text/javascript';
  if (extension === '.css' || extension === '.scss') return 'text/css';
  if (extension === '.html') return 'text/html';
  if (TEXT_EXTENSIONS.has(extension)) return 'text/plain';
  return 'text/plain';
}

function isChatSearchVisibleReference(filePath: string) {
  const normalized = filePath.replace(/\\/g, '/').toLowerCase();
  return !normalized.includes('/node_modules/')
    && !normalized.startsWith('node_modules/')
    && normalized !== 'node_modules'
    && !normalized.includes('/.git/')
    && !normalized.startsWith('.git/')
    && normalized !== '.git'
    && !normalized.includes('/dist/')
    && !normalized.startsWith('dist/')
    && normalized !== 'dist';
}

function parseMentionedReferences(message: string) {
  const references = [];
  for (const match of message.matchAll(/(^|\s)@([^\s]+)/g)) {
    const rawPath = match[2].replace(/[),.;:]+$/g, '');
    if (rawPath && !rawPath.startsWith('http')) {
      references.push(rawPath);
    }
  }
  return references;
}

export async function normalizeChatReference(project: ProjectRecord, input: ChatContextReferenceInput): Promise<NormalizedChatReference> {
  const requestedPath = (input.path ?? input.name ?? '').trim();
  if (!requestedPath) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Reference path is required');
  }

  const absolutePath = resolveProjectPath(project, requestedPath);
  const relativePath = toProjectRelative(project, absolutePath).replace(/\\/g, '/');
  if (!isChatSearchVisibleReference(relativePath)) {
    throw new ApiError(403, 'REFERENCE_NOT_VISIBLE', `Reference is not visible to chat search: ${relativePath}`);
  }

  const stat = await fs.stat(absolutePath).catch(() => null);
  if (!stat) {
    throw new ApiError(404, 'REFERENCE_NOT_FOUND', `Reference not found: ${relativePath}`);
  }

  const inferredType = stat.isDirectory() ? 'directory' : 'file';
  const type = input.type ?? inferredType;
  if (type === 'file' && !stat.isFile()) {
    throw new ApiError(400, 'REFERENCE_TYPE_MISMATCH', `Reference is not a file: ${relativePath}`);
  }
  if (type === 'directory' && !stat.isDirectory()) {
    throw new ApiError(400, 'REFERENCE_TYPE_MISMATCH', `Reference is not a directory: ${relativePath}`);
  }

  return {
    absolutePath,
    relativePath,
    type,
    name: input.name?.trim() || path.basename(relativePath),
    mime: type === 'file' ? input.mime || mimeForPath(relativePath) : input.mime,
  };
}

export async function normalizeChatReferences(project: ProjectRecord, message: string, options: ChatRequestOptions = {}) {
  const inputs: ChatContextReferenceInput[] = [
    ...(options.references ?? []),
    ...(options.files ?? []).map((file) => ({ ...file, type: 'file' as const })),
    ...parseMentionedReferences(message).map((referencePath) => ({ path: referencePath })),
  ];
  const references: NormalizedChatReference[] = [];
  const seen = new Set<string>();

  for (const input of inputs) {
    const reference = await normalizeChatReference(project, input);
    const key = `${reference.type}:${reference.relativePath.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    references.push(reference);
  }

  return references;
}

type PromptFileAttachment = {
  uri: string;
  mime: string;
  name: string;
  source: { start: number; end: number; text: string };
};

type PromptReferenceAttachment = {
  name: string;
  kind: 'local';
  uri: string;
  target: string;
  targetUri: string;
  source: { start: number; end: number; text: string };
};

type FilePartInput = {
  type: 'file';
  mime: string;
  filename: string;
  url: string;
  source: {
    type: 'file';
    path: string;
    text: { value: string; start: number; end: number };
  };
};

type TextPartInput = {
  type: 'text';
  text: string;
};

type LegacyPromptPartInput = TextPartInput | FilePartInput;

export async function buildPromptFileAttachments(project: ProjectRecord, references: NormalizedChatReference[]): Promise<PromptFileAttachment[]> {
  void project;
  const attachments: PromptFileAttachment[] = [];
  for (const reference of references) {
    if (reference.type !== 'file') continue;
    const text = await fs.readFile(reference.absolutePath, 'utf8');
    attachments.push({
      uri: reference.absolutePath,
      mime: reference.mime || mimeForPath(reference.relativePath),
      name: reference.name,
      source: { start: 0, end: text.length, text },
    });
  }
  return attachments;
}

export function buildPromptReferenceAttachments(project: ProjectRecord, references: NormalizedChatReference[]): PromptReferenceAttachment[] {
  void project;
  return references
    .filter((reference) => reference.type === 'directory')
    .map((reference) => ({
      name: reference.name,
      kind: 'local' as const,
      uri: reference.absolutePath,
      target: reference.relativePath,
      targetUri: reference.absolutePath,
      source: { start: 0, end: 0, text: `@${reference.relativePath}` },
    }));
}

async function buildFilePartInputs(project: ProjectRecord, references: NormalizedChatReference[]): Promise<FilePartInput[]> {
  void project;
  const parts: FilePartInput[] = [];
  for (const reference of references) {
    if (reference.type !== 'file') continue;
    const text = await fs.readFile(reference.absolutePath, 'utf8');
    parts.push({
      type: 'file',
      mime: reference.mime || mimeForPath(reference.relativePath),
      filename: reference.name,
      url: reference.absolutePath,
      source: {
        type: 'file',
        path: reference.relativePath,
        text: { value: text, start: 0, end: text.length },
      },
    });
  }
  return parts;
}

export async function buildCommandFileParts(project: ProjectRecord, references: NormalizedChatReference[]): Promise<FilePartInput[]> {
  const directoryReference = references.find((reference) => reference.type === 'directory');
  if (directoryReference) {
    throw new ApiError(
      400,
      'COMMAND_DIRECTORY_REFERENCE_UNSUPPORTED',
      'Directory references are supported for normal prompts but not command execution.',
      { path: directoryReference.relativePath },
    );
  }

  return buildFilePartInputs(project, references);
}

export async function buildLegacyPromptParts(project: ProjectRecord, message: string, references: NormalizedChatReference[]): Promise<LegacyPromptPartInput[]> {
  const directoryReference = references.find((reference) => reference.type === 'directory');
  if (directoryReference) {
    throw new ApiError(
      502,
      'LEGACY_PROMPT_DIRECTORY_REFERENCE_UNSUPPORTED',
      'Directory references require the OpenCode v2 prompt endpoint and cannot be sent through the legacy prompt endpoint.',
      { path: directoryReference.relativePath },
    );
  }

  return [
    { type: 'text', text: message },
    ...await buildFilePartInputs(project, references),
  ];
}

async function buildOpenCodePromptFromReferences(project: ProjectRecord, message: string, references: NormalizedChatReference[]) {
  return {
    text: message,
    files: await buildPromptFileAttachments(project, references),
    references: buildPromptReferenceAttachments(project, references),
  };
}

export async function buildOpenCodePrompt(project: ProjectRecord, message: string, options: ChatRequestOptions = {}) {
  const references = await normalizeChatReferences(project, message, options);
  return buildOpenCodePromptFromReferences(project, message, references);
}

export function isOpenCodeV2PromptResponseValidationBug(detail: string) {
  if (!detail.includes('Expected Session.Message, got {}')) {
    return false;
  }

  try {
    const parsed = JSON.parse(detail) as unknown;
    const data = isPlainObject(parsed) && isPlainObject(parsed.data) ? parsed.data : parsed;
    return isPlainObject(data)
      && data.message === 'Expected Session.Message, got {}'
      && data.kind === 'Body';
  } catch {
    return /\bBody\b/.test(detail);
  }
}

export function shouldFallbackToLegacyPrompt(detail: string, references: NormalizedChatReference[]) {
  return isOpenCodeV2PromptResponseValidationBug(detail)
    && !references.some((reference) => reference.type === 'directory');
}

function openCodePromptQuery(project: ProjectRecord) {
  return new URLSearchParams({ directory: project.rootPath }).toString();
}

function openCodeV2PromptPath(project: ProjectRecord, sessionId: string) {
  return `/api/session/${encodeURIComponent(sessionId)}/prompt?${openCodePromptQuery(project)}`;
}

function openCodeLegacyPromptPath(project: ProjectRecord, sessionId: string) {
  return `/session/${encodeURIComponent(sessionId)}/message?${openCodePromptQuery(project)}`;
}

function openCodeLegacyPromptAsyncPath(project: ProjectRecord, sessionId: string) {
  return `/session/${encodeURIComponent(sessionId)}/prompt_async?${openCodePromptQuery(project)}`;
}

function openCodeErrorDetail(error: unknown) {
  if (!(error instanceof ApiError) || !isPlainObject(error.details)) return '';
  return typeof error.details.detail === 'string' ? error.details.detail : '';
}

function throwOpenCodeV2DirectoryReferenceError(sessionId: string, detail: string): never {
  throw new ApiError(
    502,
    'OPENCODE_V2_PROMPT_UNAVAILABLE',
    'OpenCode v2 prompt endpoint rejected the request, and directory references cannot be sent through the legacy prompt endpoint.',
    {
      path: `/api/session/${sessionId}/prompt`,
      detail: detail.slice(0, 2000),
    },
  );
}

async function buildLegacyPromptBody(project: ProjectRecord, session: ChatSessionRecord, message: string, references: NormalizedChatReference[], options: ChatRequestOptions = {}) {
  const body: Record<string, unknown> = {
    parts: await buildLegacyPromptParts(project, message, references),
  };
  const model = parseOpenCodeModel(options.model ?? session.model);
  if (model) body.model = model;
  if (options.agent ?? session.agent) body.agent = options.agent ?? session.agent;
  return body;
}

async function promptOpenCodeSession(project: ProjectRecord, session: ChatSessionRecord, message: string, connection?: ServerConnectionRecord, options: ChatRequestOptions = {}) {
  await ensureOpenCodeServer(connection);
  if (!session.openCodeSessionId) {
    const remoteSession = await createOpenCodeSession(session.title, connection);
    session.openCodeSessionId = remoteSession.id;
  }
  if (!session.openCodeSessionId) {
    throw new ApiError(502, 'OPENCODE_SESSION_FAILED', 'OpenCode did not return a session id.');
  }

  const references = await normalizeChatReferences(project, message, options);
  const body: Record<string, unknown> = {
    prompt: await buildOpenCodePromptFromReferences(project, message, references),
  };

  try {
    return await openCodeJson<OpenCodeMessageResponse>(openCodeV2PromptPath(project, session.openCodeSessionId), {
      method: 'POST',
      body: JSON.stringify(body),
    }, connection, 120000);
  } catch (error) {
    const detail = openCodeErrorDetail(error);
    if (shouldFallbackToLegacyPrompt(detail, references)) {
      return openCodeJson<OpenCodeMessageResponse>(openCodeLegacyPromptPath(project, session.openCodeSessionId), {
        method: 'POST',
        body: JSON.stringify(await buildLegacyPromptBody(project, session, message, references, options)),
      }, connection, 120000);
    }
    if (isOpenCodeV2PromptResponseValidationBug(detail)) {
      throwOpenCodeV2DirectoryReferenceError(session.openCodeSessionId, detail);
    }
    throw error;
  }
}

export async function createChatSession(projectId: string, input: {
  title?: string;
  agent?: string;
  model?: string;
  skills?: string[];
  mcps?: string[];
}) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);
  await ensureOpenCodeServer(connection);
  const body: Record<string, unknown> = { title: input.title ?? 'Untitled session' };
  const model = parseOpenCodeModel(input.model);
  if (input.agent) body.agent = input.agent;
  if (model) body.model = { id: model.modelID, providerID: model.providerID };
  const remoteSession = await openCodeJson<OpenCodeSessionRecord>('/session', {
    method: 'POST',
    body: JSON.stringify(body),
  }, connection);
  return mapOpenCodeSession(project, remoteSession);
}

export async function updateChatSessionContext(projectId: string, sessionId: string, input: {
  agent?: string;
  model?: string;
  skills?: string[];
  mcps?: string[];
}) {
  // OpenCode persists session agent/model on creation and does not expose a general
  // context patch endpoint. Keep this route compatible while returning the live source of truth.
  void input;
  const detail = await getChatSession(projectId, sessionId);
  return detail.session;
}

export async function listChatSessions(projectId: string, query: { status?: string } = {}) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);
  await ensureOpenCodeServer(connection);
  const remoteSessions = await openCodeJson<OpenCodeSessionRecord[]>('/session?scope=project&limit=100', { method: 'GET' }, connection);
  return remoteSessions
    .map((session) => mapOpenCodeSession(project, session))
    .filter((session) => !query.status || query.status === 'all' || session.status === query.status)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .map((session) => ({
      ...session,
      messageCount: undefined,
      lastMessageAt: session.updatedAt,
      lastMessagePreview: '',
    }));
}

export async function getChatSession(projectId: string, sessionId: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);
  await ensureOpenCodeServer(connection);
  const remoteSession = await openCodeJson<OpenCodeSessionRecord>(`/session/${encodeURIComponent(sessionId)}`, {
    method: 'GET',
  }, connection);
  const messages = await openCodeJson<OpenCodeMessageEnvelope[]>(`/session/${encodeURIComponent(sessionId)}/message`, {
    method: 'GET',
  }, connection);
  const session = mapOpenCodeSession(project, remoteSession);
  const mappedMessages = messages
    .map((message) => mapOpenCodeMessage(message, session.id))
    .filter((message): message is ChatMessageRecord => !!message)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  const pendingPermissions = await listPendingPermissionPrompts(connection, session.id);
  const messagesWithPendingPermissions = appendPendingPermissionPrompts(mappedMessages, pendingPermissions);
  return {
    session: {
      ...session,
      messageCount: messagesWithPendingPermissions.length,
      lastMessageAt: messagesWithPendingPermissions.at(-1)?.createdAt ?? session.updatedAt,
      lastMessagePreview: messagesWithPendingPermissions.at(-1)?.content.slice(0, 180) ?? '',
    },
    messages: messagesWithPendingPermissions,
  };
}

export async function updateChatSession(projectId: string, sessionId: string, input: {
  title?: string;
  status?: 'active' | 'archived' | 'unknown';
  agent?: string;
  model?: string;
  skills?: string[];
  mcps?: string[];
}) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);
  await ensureOpenCodeServer(connection);
  const current = await openCodeJson<OpenCodeSessionRecord>(`/session/${encodeURIComponent(sessionId)}`, {
    method: 'GET',
  }, connection);
  const body: Record<string, unknown> = {};

  if (input.title !== undefined) {
    body.title = input.title.trim() || current.title;
  }
  if (input.status === 'archived') {
    body.time = { archived: Date.now() };
  } else if (input.status === 'active') {
    body.time = { archived: 0 };
  }
  if (Object.keys(body).length > 0) {
    await openCodeJson<OpenCodeSessionRecord>(`/session/${encodeURIComponent(sessionId)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }, connection);
  }
  return (await getChatSession(projectId, sessionId)).session;
}

export async function searchChatFiles(projectId: string, query: { q?: string; limit?: number }) {
  return (await searchChatReferences(projectId, query))
    .filter((reference) => reference.type === 'file')
    .map((reference) => ({
      path: reference.path,
      name: reference.name,
      mime: reference.mime,
    }));
}

export async function searchChatReferences(projectId: string, query: { q?: string; limit?: number }) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);
  const searchText = query.q?.trim() || '';
  const limit = Math.min(Math.max(Number(query.limit) || 30, 1), 80);
  const results = new Map<string, { path: string; name: string; mime?: string; type: 'file' | 'directory' }>();
  const addResult = (item: string, type: 'file' | 'directory') => {
    const absolutePath = resolveProjectPath(project, item);
    const relativePath = toProjectRelative(project, absolutePath).replace(/\\/g, '/');
    if (!isChatSearchVisibleReference(relativePath)) return;
    const key = `${type}:${relativePath.toLowerCase()}`;
    if (results.has(key)) return;
    results.set(key, {
      path: relativePath,
      name: path.basename(relativePath),
      mime: type === 'file' ? mimeForPath(relativePath) : undefined,
      type,
    });
  };

  try {
    await ensureOpenCodeServer(connection);
    const searchByType = async (type: 'file' | 'directory') => {
      const params = new URLSearchParams({
        directory: project.rootPath,
        query: searchText || '.',
        type,
        limit: String(limit),
      });
      return openCodeJson<string[]>(`/find/file?${params.toString()}`, { method: 'GET' }, connection, 10000);
    };
    const [directories, files] = await Promise.all([searchByType('directory'), searchByType('file')]);
    directories.forEach((item) => addResult(item, 'directory'));
    files.forEach((item) => addResult(item, 'file'));
  } catch {
    const rgQuery = searchText.toLowerCase();
    const { stdout } = await execFileAsync('rg', ['--files', '--glob', '!node_modules/**'], {
      cwd: project.rootPath,
      timeout: 5000,
      maxBuffer: 1024 * 1024,
    }).catch(() => ({ stdout: '' }));
    stdout
      .split(/\r?\n/)
      .map((item) => item.trim().replace(/\\/g, '/'))
      .filter((item) => item && isChatSearchVisibleReference(item))
      .forEach((item) => {
        const directory = path.posix.dirname(item);
        if (directory && directory !== '.' && (!rgQuery || directory.toLowerCase().includes(rgQuery))) {
          addResult(directory, 'directory');
        }
        if (!rgQuery || item.toLowerCase().includes(rgQuery)) {
          addResult(item, 'file');
        }
      });
  }

  return [...results.values()]
    .sort((left, right) => {
      if (left.type !== right.type) return left.type === 'directory' ? -1 : 1;
      return left.path.localeCompare(right.path);
    })
    .slice(0, limit);
}

type ProjectPathSearchResult = {
  path: string;
  name: string;
  type: 'file' | 'directory';
};

function addProjectPathResult(
  project: ProjectRecord,
  results: Map<string, ProjectPathSearchResult>,
  itemPath: string,
  fallbackType: 'file' | 'directory',
) {
  const absolutePath = resolveProjectPath(project, itemPath);
  const relativePath = toProjectRelative(project, absolutePath).replace(/\\/g, '/');
  if (!relativePath || !isChatSearchVisibleReference(relativePath)) return;
  results.set(relativePath, {
    path: relativePath,
    name: path.basename(relativePath),
    type: fallbackType,
  });
}

export async function searchProjectPaths(projectId: string, query: { q?: string; limit?: number }) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);
  const searchText = query.q?.trim() || '';
  const limit = Math.min(Math.max(Number(query.limit) || 30, 1), 80);
  const results = new Map<string, ProjectPathSearchResult>();

  try {
    await ensureOpenCodeServer(connection);
    for (const type of ['directory', 'file'] as const) {
      const params = new URLSearchParams({
        directory: project.rootPath,
        query: searchText || '.',
        type,
        limit: String(limit),
      });
      const paths = await openCodeJson<string[]>(`/find/file?${params.toString()}`, { method: 'GET' }, connection, 10000);
      paths.forEach((item) => addProjectPathResult(project, results, item, type));
      if (results.size >= limit) break;
    }
  } catch {
    const rgQuery = searchText.toLowerCase();
    const { stdout } = await execFileAsync('rg', ['--files', '--glob', '!node_modules/**'], {
      cwd: project.rootPath,
      timeout: 5000,
      maxBuffer: 1024 * 1024,
    }).catch(() => ({ stdout: '' }));

    stdout
      .split(/\r?\n/)
      .map((item) => item.trim().replace(/\\/g, '/'))
      .filter((item) => item && (!rgQuery || item.toLowerCase().includes(rgQuery)))
      .forEach((item) => {
        addProjectPathResult(project, results, item, 'file');
        const directory = path.posix.dirname(item);
        if (directory && directory !== '.') {
          addProjectPathResult(project, results, directory, 'directory');
        }
      });
  }

  return [...results.values()]
    .sort((left, right) => {
      if (left.type !== right.type) return left.type === 'directory' ? -1 : 1;
      return left.path.localeCompare(right.path);
    })
    .slice(0, limit);
}

export async function deleteChatSession(projectId: string, sessionId: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);

  await openCodeJson<boolean>(`/session/${encodeURIComponent(sessionId)}`, {
    method: 'DELETE',
  }, connection);
  return { deleted: true, id: sessionId };
}

export async function exportChatSession(projectId: string, sessionId: string) {
  const detail = await getChatSession(projectId, sessionId);
  return {
    exportedAt: now(),
    ...detail,
  };
}

export async function respondChatPermission(projectId: string, sessionId: string, permissionId: string, input: { response?: string; reply?: string; message?: string }) {
  const reply = input.reply ?? input.response;
  if (reply !== 'once' && reply !== 'always' && reply !== 'reject') {
    throw new ApiError(400, 'VALIDATION_ERROR', 'response must be once, always, or reject');
  }

  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);
  await ensureOpenCodeServer(connection);

  const query = new URLSearchParams({ directory: project.rootPath });
  const body: Record<string, unknown> = { reply };
  if (input.message) body.message = input.message;

  try {
    const accepted = await openCodeJson<boolean>(`/permission/${encodeURIComponent(permissionId)}/reply?${query.toString()}`, {
      method: 'POST',
      body: JSON.stringify(body),
    }, connection, 10000);
    return { permissionId, response: reply, accepted };
  } catch (error) {
    const accepted = await openCodeJson<boolean>(`/session/${encodeURIComponent(sessionId)}/permissions/${encodeURIComponent(permissionId)}?${query.toString()}`, {
      method: 'POST',
      body: JSON.stringify({ response: reply }),
    }, connection, 10000).catch(() => {
      throw error;
    });
    return { permissionId, response: reply, accepted };
  }
}

function openCodeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (isPlainObject(value) && Array.isArray(value.value)) return value.value as T[];
  return [];
}

function openCodeInfo(message: unknown) {
  return isPlainObject(message) && isPlainObject(message.info) ? message.info : {};
}

function openCodeMessageId(message: unknown) {
  const id = openCodeInfo(message).id;
  return typeof id === 'string' && id.trim() ? id : undefined;
}

function openCodeMessageRole(message: unknown) {
  const role = openCodeInfo(message).role;
  return typeof role === 'string' ? role : undefined;
}

async function listOpenCodeSessionMessages(connection: ServerConnectionRecord | undefined, openCodeSessionId: string) {
  const rawMessages = await openCodeJson<unknown>(`/session/${encodeURIComponent(openCodeSessionId)}/message`, {
    method: 'GET',
  }, connection, 30000);
  return openCodeArray<OpenCodeMessageEnvelope>(rawMessages);
}

function latestOpenCodeUserMessageIdFromMessages(messages: OpenCodeMessageEnvelope[]) {
  const latest = [...messages].reverse()
    .find((message) => openCodeMessageRole(message) === 'user' && openCodeMessageId(message));
  return openCodeMessageId(latest);
}

function normalizeSnapshotFilePath(project: ProjectRecord, filePath: string) {
  const normalized = normalizeProjectFilePath(filePath);
  if (!path.isAbsolute(normalized)) return normalized;
  const absolutePath = resolveProjectPath(project, normalized, { allowMissing: true });
  return toProjectRelative(project, absolutePath).replace(/\\/g, '/');
}

function normalizeSnapshotDiff(project: ProjectRecord, value: unknown): SnapshotFileDiff | null {
  if (!isPlainObject(value) || typeof value.file !== 'string' || !value.file.trim()) return null;
  try {
    return {
      file: normalizeSnapshotFilePath(project, value.file),
      patch: typeof value.patch === 'string' ? value.patch : undefined,
      additions: typeof value.additions === 'number' ? value.additions : 0,
      deletions: typeof value.deletions === 'number' ? value.deletions : 0,
      status: typeof value.status === 'string' ? value.status : 'modified',
    };
  } catch {
    return null;
  }
}

async function fetchOpenCodeSnapshotDiffs(project: ProjectRecord, connection: ServerConnectionRecord | undefined, openCodeSessionId: string, messageId: string) {
  const query = new URLSearchParams({ messageID: messageId });
  const rawDiffs = await openCodeJson<unknown>(`/session/${encodeURIComponent(openCodeSessionId)}/diff?${query.toString()}`, {
    method: 'GET',
  }, connection, 30000);
  return openCodeArray<unknown>(rawDiffs)
    .map((diff) => normalizeSnapshotDiff(project, diff))
    .filter((diff): diff is SnapshotFileDiff => !!diff && !isIgnoredReviewPath(diff.file ?? ''));
}

function safeBackupSegment(value: string) {
  return value.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'unknown';
}

function patchBackupText(diff: SnapshotFileDiff) {
  if (diff.patch?.trim()) return redactSecrets(diff.patch);
  return [
    `Snapshot patch was not provided by OpenCode for ${diff.file}.`,
    `Status: ${diff.status ?? 'modified'}`,
    `Additions: ${diff.additions ?? 0}`,
    `Deletions: ${diff.deletions ?? 0}`,
    '',
  ].join('\n');
}

async function writeChatTurnPatch(diff: SnapshotFileDiff, patchRoot: string) {
  const filePath = diff.file ?? 'unknown';
  const patchPath = ensureBackupDestination(patchRoot, `${filePath}.patch`);
  await fs.mkdir(path.dirname(patchPath), { recursive: true });
  await fs.writeFile(patchPath, patchBackupText(diff), 'utf8');
  return patchPath;
}

async function backupChatTurnSnapshot(project: ProjectRecord, connection: ServerConnectionRecord | undefined, openCodeSessionId: string): Promise<ChatTurnBackup | undefined> {
  const messages = await listOpenCodeSessionMessages(connection, openCodeSessionId);
  const messageId = latestOpenCodeUserMessageIdFromMessages(messages);
  if (!messageId) return undefined;

  const diffs = await fetchOpenCodeSnapshotDiffs(project, connection, openCodeSessionId, messageId);
  if (diffs.length === 0) return undefined;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupRoot = path.join(
    getStateDirectory(),
    'chat-backups',
    project.id,
    `${timestamp}-${safeBackupSegment(openCodeSessionId)}-${safeBackupSegment(messageId)}`,
  );
  const currentRoot = path.join(backupRoot, 'current-working-tree');
  const headRoot = path.join(backupRoot, 'git-head-original');
  const patchRoot = path.join(backupRoot, 'snapshot-patches');
  await fs.mkdir(currentRoot, { recursive: true });
  await fs.mkdir(headRoot, { recursive: true });
  await fs.mkdir(patchRoot, { recursive: true });

  const files = [];
  for (const diff of diffs) {
    const filePath = diff.file;
    if (!filePath) continue;
    const currentBackupPath = await copyWorkingTreeSnapshot(project, filePath, currentRoot);
    const headBackupPath = await copyHeadSnapshot(project, filePath, headRoot);
    const patchBackupPath = await writeChatTurnPatch(diff, patchRoot);
    files.push({
      id: makeId('bak'),
      filePath,
      status: diff.status ?? 'modified',
      additions: diff.additions ?? 0,
      deletions: diff.deletions ?? 0,
      currentBackupPath,
      headBackupPath,
      patchBackupPath,
    });
  }

  if (files.length === 0) return undefined;

  const createdAt = now();
  const backup: ChatTurnBackup = {
    backupRoot,
    createdAt,
    sessionId: openCodeSessionId,
    messageId,
    files,
  };

  await fs.writeFile(path.join(backupRoot, 'metadata.json'), JSON.stringify({
    createdAt,
    projectId: project.id,
    projectRoot: project.rootPath,
    openCodeSessionId,
    messageId,
    files,
  }, null, 2), 'utf8');
  await fs.writeFile(path.join(backupRoot, 'README.txt'), [
    'Chat turn backup created from OpenCode snapshot diff.',
    `Created: ${createdAt}`,
    `Project: ${project.rootPath}`,
    `OpenCode session: ${openCodeSessionId}`,
    `OpenCode message: ${messageId}`,
    '',
    'Files:',
    ...files.map((file) => `- ${file.status} ${file.filePath} (+${file.additions} -${file.deletions})`),
    '',
  ].join('\n'), 'utf8');

  const state = await loadState();
  state.auditLogs.unshift({
    id: makeId('audit'),
    actor: 'opencode-chatbot',
    action: 'backup.chat_turn_snapshot',
    targetType: 'chat',
    targetId: openCodeSessionId,
    metadata: {
      projectId: project.id,
      messageId,
      backupRoot,
      fileCount: files.length,
      files: files.map((file) => file.filePath),
    },
    createdAt,
  });
  await saveState(state);

  return backup;
}

function serializeChatBackupError(error: unknown): ChatTurnBackupFailure {
  if (error instanceof ApiError) {
    return { code: error.code, message: error.message };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'Unable to create chat turn backup.' };
}

async function tryBackupChatTurnSnapshot(
  project: ProjectRecord,
  connection: ServerConnectionRecord | undefined,
  openCodeSessionId?: string,
): Promise<{ backup?: ChatTurnBackup; backupError?: ChatTurnBackupFailure }> {
  if (!openCodeSessionId) return {};
  try {
    const backup = await backupChatTurnSnapshot(project, connection, openCodeSessionId);
    return backup ? { backup } : {};
  } catch (error) {
    return { backupError: serializeChatBackupError(error) };
  }
}

function appendChatBackupPart(message: ChatMessageRecord, backup?: ChatTurnBackup) {
  if (!backup) return message;
  return {
    ...message,
    parts: [
      ...(message.parts ?? [{ type: 'text', text: message.content }]),
      {
        type: 'chat_backup',
        text: `Backup saved for ${backup.files.length} changed file(s).`,
        backupRoot: backup.backupRoot,
        createdAt: backup.createdAt,
        sessionId: backup.sessionId,
        files: backup.files,
        messageId: backup.messageId,
      },
    ],
  };
}

export async function sendChatMessage(projectId: string, sessionId: string, input: { message: string; attachments?: unknown[] } & ChatRequestOptions) {
  const trimmedMessage = input.message?.trim();
  if (!trimmedMessage) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'message is required');
  }

  const shouldCreateConfigIntent = hasConfigMutationIntent(trimmedMessage);

  const state = await loadState();
  const project = assertProject(state, projectId);
  const session = (await getChatSession(projectId, sessionId)).session;
  const connection = getDefaultServerConnection(state, project);
  const openCodeResponse = input.command
    ? await commandOpenCodeSession(project, session, input.command, input.arguments ?? '', connection, input)
    : await promptOpenCodeSession(project, session, trimmedMessage, connection, input);
  const assistantContent = extractOpenCodeMainText(openCodeResponse.parts) || 'OpenCode returned an empty response.';
  const userMessage: ChatMessageRecord = {
    id: makeId('msg'),
    sessionId,
    role: 'user',
    content: trimmedMessage,
    parts: [{ type: 'text', text: trimmedMessage }],
    createdAt: now(),
  };
  let assistantMessage: ChatMessageRecord = {
    id: makeId('msg'),
    sessionId,
    role: 'assistant',
    content: assistantContent,
    parts: normalizeOpenCodeParts(openCodeResponse.parts) ?? [{ type: 'text', text: assistantContent }],
    createdAt: now(),
  };
  const chatBackup = await tryBackupChatTurnSnapshot(project, connection, session.openCodeSessionId);
  assistantMessage = appendChatBackupPart(assistantMessage, chatBackup.backup);
  const configIntent = shouldCreateConfigIntent
    ? await parseConfigIntent({ projectId, message: trimmedMessage })
    : null;
  return {
    sessionId: session.id,
    openCodeSessionId: session.openCodeSessionId,
    userMessage,
    assistantMessage,
    info: assistantMessage,
    parts: assistantMessage.parts ?? [{ type: 'text', text: assistantMessage.content }],
    configChangeId: configIntent?.configChangeId,
    proposal: configIntent?.proposal,
    ...chatBackup,
  };
}

type PermissionReply = 'once' | 'always' | 'reject';

type ChatToolActivity = {
  id: string;
  callId: string;
  tool: string;
  title: string;
  status: 'pending' | 'running' | 'success' | 'error';
  input?: Record<string, unknown>;
  detail?: string;
  timestamp?: number;
};

type ChatPermissionPrompt = {
  id: string;
  sessionId: string;
  permission: string;
  title: string;
  detail: string;
  patterns: string[];
  metadata: Record<string, unknown>;
  tool?: {
    messageId?: string;
    callId?: string;
  };
  always: string[];
  status: 'pending' | 'answered';
};

type ChatStreamEvent =
  | { type: 'user'; message: ChatMessageRecord }
  | { type: 'assistant_start'; message: ChatMessageRecord }
  | { type: 'thinking_delta'; delta: string }
  | { type: 'text_delta'; delta: string }
  | { type: 'tool_activity'; activity: ChatToolActivity }
  | { type: 'permission_prompt'; prompt: ChatPermissionPrompt }
  | { type: 'permission_resolved'; permissionId: string; response: PermissionReply }
  | {
    type: 'done'; response: {
      sessionId: string;
      openCodeSessionId?: string;
      userMessage: ChatMessageRecord;
      assistantMessage: ChatMessageRecord;
      info: ChatMessageRecord;
      parts: Array<{ type?: string; text?: string;[key: string]: unknown }>;
      configChangeId?: string;
      proposal?: Record<string, unknown>;
      backup?: ChatTurnBackup;
      backupError?: ChatTurnBackupFailure;
    }
  };

async function commandOpenCodeSession(project: ProjectRecord, session: ChatSessionRecord, command: string, commandArguments: string, connection?: ServerConnectionRecord, options: ChatRequestOptions = {}) {
  if (!session.openCodeSessionId) {
    throw new ApiError(502, 'OPENCODE_SESSION_FAILED', 'OpenCode did not return a session id.');
  }

  const references = await normalizeChatReferences(project, commandArguments, options);
  const parts = await buildCommandFileParts(project, references);
  const body: Record<string, unknown> = {
    command,
    arguments: commandArguments,
  };
  if (parts.length > 0) body.parts = parts;
  if (options.model ?? session.model) body.model = options.model ?? session.model;
  if (options.agent ?? session.agent) body.agent = options.agent ?? session.agent;

  return openCodeJson<OpenCodeMessageResponse>(`/session/${encodeURIComponent(session.openCodeSessionId)}/command`, {
    method: 'POST',
    body: JSON.stringify(body),
  }, connection, 120000);
}

async function promptOpenCodeSessionAsync(project: ProjectRecord, session: ChatSessionRecord, message: string, connection?: ServerConnectionRecord, options: ChatRequestOptions = {}) {
  if (!session.openCodeSessionId) {
    throw new ApiError(502, 'OPENCODE_SESSION_FAILED', 'OpenCode did not return a session id.');
  }

  const references = await normalizeChatReferences(project, message, options);
  const body: Record<string, unknown> = {
    prompt: await buildOpenCodePromptFromReferences(project, message, references),
  };

  const response = await openCodeFetch(openCodeV2PromptPath(project, session.openCodeSessionId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: options.signal,
    body: JSON.stringify(body),
  }, connection, 120000);
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    if (shouldFallbackToLegacyPrompt(detail, references)) {
      const fallbackResponse = await openCodeFetch(openCodeLegacyPromptAsyncPath(project, session.openCodeSessionId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: options.signal,
        body: JSON.stringify(await buildLegacyPromptBody(project, session, message, references, options)),
      }, connection, 120000);
      if (fallbackResponse.ok) {
        return;
      }
      const fallbackDetail = await fallbackResponse.text().catch(() => '');
      throw new ApiError(502, 'OPENCODE_CONNECTION_FAILED', `OpenCode request failed with HTTP ${fallbackResponse.status}`, {
        path: `/session/${session.openCodeSessionId}/prompt_async`,
        detail: fallbackDetail.slice(0, 2000),
      });
    }
    if (isOpenCodeV2PromptResponseValidationBug(detail)) {
      throwOpenCodeV2DirectoryReferenceError(session.openCodeSessionId, detail);
    }
    throw new ApiError(502, 'OPENCODE_CONNECTION_FAILED', `OpenCode request failed with HTTP ${response.status}`, {
      path: `/api/session/${session.openCodeSessionId}/prompt`,
      detail: detail.slice(0, 2000),
    });
  }
}

async function commandOpenCodeSessionAsync(project: ProjectRecord, session: ChatSessionRecord, command: string, commandArguments: string, connection?: ServerConnectionRecord, options: ChatRequestOptions = {}) {
  if (!session.openCodeSessionId) {
    throw new ApiError(502, 'OPENCODE_SESSION_FAILED', 'OpenCode did not return a session id.');
  }

  const references = await normalizeChatReferences(project, commandArguments, options);
  const parts = await buildCommandFileParts(project, references);
  const body: Record<string, unknown> = {
    command,
    arguments: commandArguments,
  };
  if (parts.length > 0) body.parts = parts;
  if (options.model ?? session.model) body.model = options.model ?? session.model;
  if (options.agent ?? session.agent) body.agent = options.agent ?? session.agent;

  const response = await openCodeFetch(`/session/${encodeURIComponent(session.openCodeSessionId)}/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: options.signal,
    body: JSON.stringify(body),
  }, connection, 120000);
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new ApiError(502, 'OPENCODE_CONNECTION_FAILED', `OpenCode request failed with HTTP ${response.status}`, {
      path: `/session/${session.openCodeSessionId}/command`,
      detail: detail.slice(0, 2000),
    });
  }
  return response.json().catch(() => null) as Promise<OpenCodeMessageResponse | null>;
}

async function abortOpenCodeSession(connection: ServerConnectionRecord | undefined, sessionId: string) {
  await openCodeFetch(`/session/${encodeURIComponent(sessionId)}/abort`, {
    method: 'POST',
  }, connection, 5000).catch(() => null);
}

function parseServerSentEvent(block: string) {
  const data = block
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())
    .join('\n')
    .trim();

  if (!data || data === '[DONE]') return null;
  try {
    return JSON.parse(data) as { type?: string; properties?: unknown };
  } catch {
    return null;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const CHAT_STREAM_TIMEOUT_MS: number | null = null;

export async function* readServerSentEvents(response: Response, idlePollMs = 1000) {
  const reader = response.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  let buffer = '';
  let pendingRead = reader.read();
  let readSettled = false;

  try {
    while (true) {
      const readResult = await Promise.race([
        pendingRead.then((result) => ({ type: 'read' as const, result })),
        sleep(idlePollMs).then(() => ({ type: 'idle' as const })),
      ]);

      if (readResult.type === 'idle') {
        yield { type: '__poll' };
        continue;
      }

      const { value, done } = readResult.result;
      readSettled = true;
      if (!done) {
        readSettled = false;
        pendingRead = reader.read();
      }
      buffer += decoder.decode(value, { stream: !done }).replace(/\r\n/g, '\n');

      let separatorIndex = buffer.indexOf('\n\n');
      while (separatorIndex !== -1) {
        const event = parseServerSentEvent(buffer.slice(0, separatorIndex));
        buffer = buffer.slice(separatorIndex + 2);
        if (event) yield event;
        separatorIndex = buffer.indexOf('\n\n');
      }

      if (done) {
        const event = parseServerSentEvent(buffer);
        if (event) yield event;
        break;
      }
    }
  } finally {
    if (!readSettled) {
      await reader.cancel().catch(() => undefined);
      await pendingRead.catch(() => undefined);
    }
    reader.releaseLock();
  }
}

function eventProperties(event: { properties?: unknown }) {
  return isPlainObject(event.properties) ? event.properties : {};
}

function eventSessionId(event: { properties?: unknown }) {
  const properties = eventProperties(event);
  if (typeof properties.sessionID === 'string') return properties.sessionID;
  const part = properties.part;
  if (isPlainObject(part) && typeof part.sessionID === 'string') return part.sessionID;
  return undefined;
}

export function shouldFinishStreamForIdleEvent(event: { type?: string; properties?: unknown }, openCodeSessionId: string) {
  if (event.type !== 'session.idle') return false;
  const currentSessionId = eventSessionId(event);
  return !currentSessionId || currentSessionId === openCodeSessionId;
}

function openCodeEventErrorMessage(error: unknown) {
  if (!isPlainObject(error)) return undefined;
  if (typeof error.message === 'string') return error.message;
  const data = error.data;
  if (isPlainObject(data) && typeof data.message === 'string') return data.message;
  return undefined;
}

function isAbortError(error: unknown) {
  return error instanceof Error && (error.name === 'AbortError' || /aborted/i.test(error.message));
}

function valueString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function valueNumber(value: unknown) {
  return typeof value === 'number' ? value : undefined;
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function firstInputString(input: Record<string, unknown> | undefined, keys: string[]) {
  if (!input) return '';
  for (const key of keys) {
    const value = input[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function humanizeIdentifier(value: string) {
  const words = value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
  if (words.length === 0) return value.trim();
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function compactPromptText(value: string, maxLength = 240) {
  const compact = value.replace(/\s+/g, ' ').trim();
  return compact.length > maxLength ? `${compact.slice(0, maxLength - 3)}...` : compact;
}

function summarizePermissionValue(value: unknown): string {
  if (typeof value === 'string') return compactPromptText(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    const primitiveItems = value
      .map(summarizePermissionValue)
      .filter(Boolean);
    if (primitiveItems.length > 0) return compactPromptText(primitiveItems.join(', '));
  }
  if (isPlainObject(value) || Array.isArray(value)) {
    try {
      return compactPromptText(JSON.stringify(value));
    } catch {
      return '';
    }
  }
  return '';
}

function summarizePermissionRecord(input: Record<string, unknown>, maxEntries = 4) {
  return Object.entries(input)
    .map(([key, value]) => {
      const summary = summarizePermissionValue(value);
      return summary ? `${key}: ${summary}` : '';
    })
    .filter(Boolean)
    .slice(0, maxEntries)
    .join('\n');
}

function permissionPromptDetail(permission: string, patterns: string[], metadata: Record<string, unknown>) {
  const patternDetail = patterns.map((pattern) => pattern.trim()).filter(Boolean).join('\n');
  if (patternDetail) return patternDetail;
  const metadataDetail = summarizePermissionRecord(metadata);
  return metadataDetail || humanizeIdentifier(permission);
}

function permissionPromptTitle(permission: string, detail: string) {
  const label = humanizeIdentifier(permission);
  const firstDetailLine = compactPromptText(detail.split('\n')[0] ?? '', 120);
  return firstDetailLine && firstDetailLine !== label ? `${label} ${firstDetailLine}` : label;
}

function formatToolName(tool: string) {
  const normalized = tool.toLowerCase();
  const labels: Record<string, string> = {
    bash: 'Bash',
    edit: 'Edit',
    glob: 'Glob',
    grep: 'Grep',
    lsp: 'LSP',
    read: 'Read',
    skill: 'Skill',
    webfetch: 'WebFetch',
    websearch: 'WebSearch',
    write: 'Write',
  };
  return labels[normalized] ?? tool.replace(/(^|[-_])(\w)/g, (_match, _separator: string, char: string) => char.toUpperCase());
}

function toolTarget(tool: string, input: Record<string, unknown> | undefined) {
  const normalized = tool.toLowerCase();
  if (normalized === 'read') return firstInputString(input, ['filePath', 'path', 'file', 'url']);
  if (normalized === 'webfetch') return firstInputString(input, ['url']);
  if (normalized === 'websearch') return firstInputString(input, ['query']);
  if (normalized === 'bash') return firstInputString(input, ['command']);
  if (normalized === 'grep') return firstInputString(input, ['pattern', 'query']);
  if (normalized === 'glob') return firstInputString(input, ['pattern']);
  if (normalized === 'skill') return firstInputString(input, ['name']);
  if (normalized === 'write' || normalized === 'edit') return firstInputString(input, ['filePath', 'path', 'file']);
  return firstInputString(input, ['title', 'name', 'url', 'query', 'path', 'filePath', 'command']);
}

function formatToolTitle(tool: string, input: Record<string, unknown> | undefined, explicitTitle?: string) {
  if (explicitTitle?.trim()) return explicitTitle.trim();
  const label = formatToolName(tool);
  const target = toolTarget(tool, input);
  return target ? `${label} ${target}` : label;
}

function toolStatusFromEvent(eventType: string, stateStatus?: string): ChatToolActivity['status'] {
  if (eventType.endsWith('.success')) return 'success';
  if (eventType.endsWith('.failed')) return 'error';
  if (stateStatus === 'completed') return 'success';
  if (stateStatus === 'error') return 'error';
  if (stateStatus === 'pending') return 'pending';
  return 'running';
}

function toolActivityFromEvent(event: { id?: string; type?: string; properties?: unknown }): ChatToolActivity | null {
  const properties = eventProperties(event);
  const part = isPlainObject(properties.part) ? properties.part : undefined;
  const state = isPlainObject(part?.state) ? part.state : undefined;
  const input = isPlainObject(properties.input)
    ? properties.input
    : isPlainObject(state?.input)
      ? state.input
      : undefined;
  const tool = valueString(properties.tool) || valueString(part?.tool) || valueString(properties.name);
  const callId = valueString(properties.callID) || valueString(part?.callID) || valueString(properties.partID) || valueString(event.id);
  if (!tool || !callId) return null;

  const status = toolStatusFromEvent(valueString(event.type), valueString(state?.status));
  const detail = valueString(properties.error) || valueString(state?.error);
  const explicitTitle = valueString(state?.title);

  return {
    id: `tool_${callId}`,
    callId,
    tool,
    title: formatToolTitle(tool, input, explicitTitle),
    status,
    ...(input ? { input } : {}),
    ...(detail ? { detail } : {}),
    timestamp: valueNumber(properties.timestamp) ?? valueNumber(properties.time),
  };
}

function permissionPromptFromEvent(event: { properties?: unknown }): ChatPermissionPrompt | null {
  return permissionPromptFromRecord(eventProperties(event));
}

export function permissionPromptFromRecord(record: unknown): ChatPermissionPrompt | null {
  const properties = isPlainObject(record) ? record : {};
  const id = valueString(properties.id) || valueString(properties.requestID) || valueString(properties.permissionID);
  const sessionId = valueString(properties.sessionID) || valueString(properties.sessionId);
  const permission = valueString(properties.permission);
  if (!id || !sessionId || !permission) return null;

  const metadata = isPlainObject(properties.metadata) ? properties.metadata : {};
  const patterns = stringArray(properties.patterns);
  const always = stringArray(properties.always);
  const tool = isPlainObject(properties.tool) ? properties.tool : undefined;
  const detail = permissionPromptDetail(permission, patterns, metadata);
  const title = permissionPromptTitle(permission, detail);

  return {
    id,
    sessionId,
    permission,
    title,
    detail,
    patterns,
    metadata,
    ...(tool ? {
      tool: {
        messageId: valueString(tool.messageID) || undefined,
        callId: valueString(tool.callID) || undefined,
      },
    } : {}),
    always,
    status: 'pending',
  };
}

async function listPendingPermissionPrompts(connection: ServerConnectionRecord | undefined, sessionId: string) {
  const records = await openCodeJson<unknown>('/permission', { method: 'GET' }, connection, 10000)
    .catch(() => []);
  return openCodeArray<unknown>(records)
    .map(permissionPromptFromRecord)
    .filter((prompt): prompt is ChatPermissionPrompt => !!prompt && prompt.sessionId === sessionId);
}

function permissionPromptPart(prompt: ChatPermissionPrompt) {
  return {
    ...prompt,
    type: 'permission_prompt',
    text: prompt.title,
  };
}

export function appendPendingPermissionPrompts(messages: ChatMessageRecord[], prompts: ChatPermissionPrompt[]) {
  if (prompts.length === 0) return messages;
  const latestAssistantIndex = messages.findLastIndex((message) => message.role === 'assistant');
  const promptParts = prompts.map(permissionPromptPart);

  if (latestAssistantIndex === -1) {
    return [
      ...messages,
      {
        id: makeId('msg'),
        sessionId: prompts[0].sessionId,
        role: 'assistant' as const,
        content: '',
        parts: promptParts,
        createdAt: now(),
      },
    ];
  }

  return messages.map((message, index) => {
    if (index !== latestAssistantIndex) return message;
    const existingPermissionIds = new Set(
      (message.parts ?? [])
        .filter((part) => part.type === 'permission_prompt' && typeof part.id === 'string')
        .map((part) => part.id as string),
    );
    const newPromptParts = promptParts.filter((part) => !existingPermissionIds.has(part.id));
    if (newPromptParts.length === 0) return message;
    return {
      ...message,
      parts: [
        ...(message.parts ?? [{ type: 'text', text: message.content }]),
        ...newPromptParts,
      ],
    };
  });
}

function isPermissionReply(value: string): value is PermissionReply {
  return value === 'once' || value === 'always' || value === 'reject';
}

function permissionReplyFromEvent(event: { properties?: unknown }) {
  const properties = eventProperties(event);
  const response = valueString(properties.reply);
  if (!isPermissionReply(response)) return null;
  const permissionId = valueString(properties.requestID);
  if (!permissionId) return null;
  return { permissionId, response };
}

export async function* streamChatMessage(projectId: string, sessionId: string, input: { message: string; attachments?: unknown[]; signal?: AbortSignal } & ChatRequestOptions): AsyncGenerator<ChatStreamEvent> {
  const trimmedMessage = input.message?.trim();
  if (!trimmedMessage) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'message is required');
  }

  const shouldCreateConfigIntent = hasConfigMutationIntent(trimmedMessage);
  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);
  await ensureOpenCodeServer(connection);
  const session: ChatSessionRecord = {
    id: sessionId,
    projectId: project.id,
    openCodeSessionId: sessionId,
    title: 'OpenCode chat',
    agent: input.agent,
    model: input.model,
    skills: input.skills ?? [],
    mcps: [],
    status: 'active',
    createdAt: now(),
    updatedAt: now(),
  };
  const openCodeSessionId = sessionId;

  const userMessage: ChatMessageRecord = {
    id: makeId('msg'),
    sessionId: session.id,
    role: 'user',
    content: trimmedMessage,
    parts: [{ type: 'text', text: trimmedMessage }],
    createdAt: now(),
  };
  const assistantMessage: ChatMessageRecord = {
    id: makeId('msg'),
    sessionId: session.id,
    role: 'assistant',
    content: '',
    parts: [
      { type: 'reasoning', text: '' },
      { type: 'text', text: '' },
    ],
    createdAt: now(),
  };

  yield { type: 'user', message: userMessage };
  yield { type: 'assistant_start', message: assistantMessage };

  const eventAbortController = new AbortController();
  let streamTimedOut = false;
  const timeout = CHAT_STREAM_TIMEOUT_MS === null
    ? undefined
    : setTimeout(() => {
      streamTimedOut = true;
      eventAbortController.abort();
    }, CHAT_STREAM_TIMEOUT_MS);
  const abortEventStream = () => eventAbortController.abort();
  input.signal?.addEventListener('abort', abortEventStream, { once: true });

  let reasoningText = '';
  let mainText = '';
  let immediateResponse: OpenCodeMessageResponse | null = null;
  let requestError: unknown = null;
  const emittedPermissionIds = new Set<string>();

  try {
    const eventResponse = await openCodeFetch('/event', {
      method: 'GET',
      headers: { Accept: 'text/event-stream' },
      signal: eventAbortController.signal,
    }, connection);
    if (!eventResponse.ok) {
      const detail = await eventResponse.text().catch(() => '');
      throw new ApiError(502, 'OPENCODE_CONNECTION_FAILED', `OpenCode event stream failed with HTTP ${eventResponse.status}`, {
        detail: detail.slice(0, 2000),
      });
    }

    const requestPromise: Promise<OpenCodeMessageResponse | null> = (
      input.command
        ? commandOpenCodeSessionAsync(project, session, input.command, input.arguments ?? '', connection, input)
        : promptOpenCodeSessionAsync(project, session, trimmedMessage, connection, input).then(() => null)
    ).catch((error) => {
      requestError = error;
      eventAbortController.abort();
      return null;
    });

    for await (const event of readServerSentEvents(eventResponse)) {
      if (requestError) throw requestError;
      if (input.signal?.aborted) break;
      if (event.type === '__poll') {
        const prompts = await listPendingPermissionPrompts(connection, openCodeSessionId);
        for (const prompt of prompts) {
          if (emittedPermissionIds.has(prompt.id)) continue;
          emittedPermissionIds.add(prompt.id);
          yield { type: 'permission_prompt', prompt };
        }
        continue;
      }
      const currentSessionId = eventSessionId(event);
      if (currentSessionId && currentSessionId !== openCodeSessionId) continue;

      const toolActivity = toolActivityFromEvent(event);
      if (toolActivity) {
        yield { type: 'tool_activity', activity: toolActivity };
      }

      if (event.type === 'permission.asked') {
        const prompt = permissionPromptFromEvent(event);
        if (prompt && !emittedPermissionIds.has(prompt.id)) {
          emittedPermissionIds.add(prompt.id);
          yield { type: 'permission_prompt', prompt };
        }
      }

      if (event.type === 'permission.replied') {
        const reply = permissionReplyFromEvent(event);
        if (reply) yield { type: 'permission_resolved', ...reply };
      }

      const properties = eventProperties(event);
      const delta = typeof properties.delta === 'string' ? properties.delta : '';
      const field = typeof properties.field === 'string' ? properties.field : '';
      if (event.type === 'session.next.reasoning.delta' && delta) {
        reasoningText += delta;
        yield { type: 'thinking_delta', delta };
      }
      if (event.type === 'message.part.delta' && field === 'reasoning' && delta) {
        reasoningText += delta;
        yield { type: 'thinking_delta', delta };
      }
      if (event.type === 'session.next.reasoning.ended' && typeof properties.text === 'string' && properties.text !== reasoningText) {
        const nextText = properties.text;
        const nextDelta = nextText.startsWith(reasoningText) ? nextText.slice(reasoningText.length) : nextText;
        reasoningText = nextText;
        if (nextDelta) yield { type: 'thinking_delta', delta: nextDelta };
      }
      if (event.type === 'session.next.text.delta' && delta) {
        mainText += delta;
        yield { type: 'text_delta', delta };
      }
      if (event.type === 'message.part.delta' && field === 'text' && delta) {
        mainText += delta;
        yield { type: 'text_delta', delta };
      }
      if (event.type === 'session.next.text.ended' && typeof properties.text === 'string' && properties.text !== mainText) {
        const nextText = properties.text;
        const nextDelta = nextText.startsWith(mainText) ? nextText.slice(mainText.length) : nextText;
        mainText = nextText;
        if (nextDelta) yield { type: 'text_delta', delta: nextDelta };
      }
      if (event.type === 'session.error') {
        const message = openCodeEventErrorMessage(properties.error) ?? 'OpenCode session failed while streaming.';
        throw new ApiError(502, 'OPENCODE_SESSION_FAILED', message, properties);
      }
      if (shouldFinishStreamForIdleEvent(event, openCodeSessionId)) {
        break;
      }
    }

    if (requestError && !input.signal?.aborted) throw requestError;
    immediateResponse = await requestPromise;
  } catch (error) {
    if (input.signal?.aborted) {
      await abortOpenCodeSession(connection, openCodeSessionId);
      await tryBackupChatTurnSnapshot(project, connection, openCodeSessionId);
      throw new ApiError(499, 'CHAT_STREAM_CANCELLED', 'Chat stream was cancelled by the browser client.', {
        sessionId,
        openCodeSessionId,
      });
    }
    if (requestError) {
      throw requestError;
    }
    if (streamTimedOut || (CHAT_STREAM_TIMEOUT_MS !== null && isAbortError(error))) {
      throw new ApiError(
        504,
        'OPENCODE_STREAM_TIMEOUT',
        'OpenCode timed out while waiting for the assistant or a tool permission. Check pending OpenCode permissions, or use an agent that allows the requested tool.',
        {
          sessionId,
          openCodeSessionId,
          timeoutMs: CHAT_STREAM_TIMEOUT_MS,
        },
      );
    }
    throw error;
  } finally {
    if (timeout) clearTimeout(timeout);
    input.signal?.removeEventListener('abort', abortEventStream);
    eventAbortController.abort();
  }

  let finalAssistantMessage: ChatMessageRecord = {
    ...assistantMessage,
    content: mainText || 'OpenCode returned an empty response.',
    parts: [
      { type: 'reasoning', text: reasoningText },
      { type: 'text', text: mainText },
    ],
  };

  try {
    if (!mainText.trim()) {
      const immediateAssistantContent = extractOpenCodeMainText(immediateResponse?.parts) || '';
      if (immediateAssistantContent) {
        finalAssistantMessage = {
          ...finalAssistantMessage,
          content: immediateAssistantContent,
          parts: normalizeOpenCodeParts(immediateResponse?.parts) ?? [{ type: 'text', text: immediateAssistantContent }],
        };
      } else {
        const detail = await getChatSession(projectId, session.id);
        const latestAssistant = [...detail.messages].reverse().find((message) => message.role === 'assistant');
        if (latestAssistant?.content) {
          finalAssistantMessage = latestAssistant;
        }
      }
    } else {
      finalAssistantMessage = {
        ...finalAssistantMessage,
        content: mainText,
      };
    }
  } catch {
    // Keep the streamed content if the final history refresh is unavailable.
  }

  if (reasoningText.trim() && !hasOpenCodePartText(finalAssistantMessage.parts, 'reasoning')) {
    finalAssistantMessage = {
      ...finalAssistantMessage,
      parts: [
        { type: 'reasoning', text: reasoningText },
        ...(finalAssistantMessage.parts ?? [{ type: 'text', text: finalAssistantMessage.content }]),
      ],
    };
  }

  const chatBackup = await tryBackupChatTurnSnapshot(project, connection, openCodeSessionId);
  finalAssistantMessage = appendChatBackupPart(finalAssistantMessage, chatBackup.backup);

  const configIntent = shouldCreateConfigIntent
    ? await parseConfigIntent({ projectId, message: trimmedMessage })
    : null;

  yield {
    type: 'done',
    response: {
      sessionId: session.id,
      openCodeSessionId,
      userMessage,
      assistantMessage: finalAssistantMessage,
      info: finalAssistantMessage,
      parts: finalAssistantMessage.parts ?? [{ type: 'text', text: finalAssistantMessage.content }],
      configChangeId: configIntent?.configChangeId,
      proposal: configIntent?.proposal,
      ...chatBackup,
    },
  };
}

export async function listAuditLogs(projectId: string, query: { targetType?: string; targetId?: string; page?: number; pageSize?: number }) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  let logs = state.auditLogs;
  if (query.targetType) logs = logs.filter((log) => log.targetType === query.targetType);
  if (query.targetId) logs = logs.filter((log) => log.targetId === query.targetId);
  const scoped = logs.filter((log) => {
    const change = log.configChangeId ? state.configChanges.find((item) => item.id === log.configChangeId) : null;
    return !change || change.projectId === project.id;
  });
  return responsePage(scoped, query.page, query.pageSize);
}

export async function getConfigChange(configChangeId: string) {
  const state = await loadState();
  const change = state.configChanges.find((item) => item.id === configChangeId);
  if (!change) {
    throw new ApiError(404, 'CONFIG_CHANGE_NOT_FOUND', 'Config change not found');
  }
  return change;
}

export async function listConfigChanges(projectId: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  return state.configChanges.filter((change) => change.projectId === project.id);
}

function normalizeProjectFilePath(filePath: string) {
  return filePath.replace(/\\/g, '/').replace(/^\.\/+/, '');
}

function isIgnoredReviewPath(filePath: string) {
  const normalized = normalizeProjectFilePath(filePath).toLowerCase();
  return normalized.startsWith('.git/')
    || normalized === '.git'
    || normalized.startsWith('.pro-chatbot/')
    || normalized === '.pro-chatbot'
    || normalized.includes('/node_modules/')
    || normalized.startsWith('node_modules/');
}

function truncateReviewDiff(diff: string) {
  if (diff.length <= CHANGE_REVIEW_DIFF_LIMIT) return redactSecrets(diff);
  return `${redactSecrets(diff.slice(0, CHANGE_REVIEW_DIFF_LIMIT))}\n\n... diff truncated for review ...`;
}

function ensureBackupDestination(root: string, relativePath: string) {
  const destination = path.resolve(root, relativePath);
  if (!isInside(root, destination)) {
    throw new ApiError(403, 'PATH_OUTSIDE_BACKUP', 'Backup path escaped the backup directory');
  }
  return destination;
}

async function copyWorkingTreeSnapshot(project: ProjectRecord, filePath: string, destinationRoot: string) {
  const sourcePath = resolveProjectPath(project, filePath, { allowMissing: true });
  const destinationPath = ensureBackupDestination(destinationRoot, filePath);
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });

  if (!(await pathExists(sourcePath))) {
    const markerPath = `${destinationPath}.deleted.txt`;
    await fs.writeFile(markerPath, `Deleted or missing in working tree: ${filePath}`, 'utf8');
    return markerPath;
  }

  const stat = await fs.stat(sourcePath);
  if (stat.isDirectory()) {
    await fs.cp(sourcePath, destinationPath, { recursive: true });
    return destinationPath;
  }

  await fs.copyFile(sourcePath, destinationPath);
  return destinationPath;
}

async function copyHeadSnapshot(project: ProjectRecord, filePath: string, destinationRoot: string) {
  const destinationPath = ensureBackupDestination(destinationRoot, filePath);
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });

  try {
    const { stdout } = await execFileAsync('git', ['-C', project.rootPath, 'show', `HEAD:${filePath}`], {
      timeout: 5000,
      maxBuffer: 20 * 1024 * 1024,
    });
    await fs.writeFile(destinationPath, stdout, 'utf8');
    return destinationPath;
  } catch {
    const markerPath = `${destinationPath}.untracked.txt`;
    await fs.writeFile(markerPath, `Untracked in git: ${filePath}`, 'utf8');
    return markerPath;
  }
}

type SnapshotReviewFile = {
  id: string;
  path: string;
  status: string;
  statusCode: string;
  riskLevel: RiskLevel;
  backupEligible: boolean;
  diff: string;
  rawDiff: string;
  warnings: Array<{ code: string; message: string }>;
  sessionId: string;
  sessionTitle: string;
  messageId: string;
  messageCreatedAt: string;
  additions: number;
  deletions: number;
};

type SnapshotReviewRestoreTarget = {
  sessionId: string;
  messageId: string;
  messageCreatedAt: string;
};

const SNAPSHOT_REVIEW_SESSION_LIMIT = 100;
const SNAPSHOT_REVIEW_REMOTE_DIFF_LIMIT = 120;

type OpenCodePathInfo = {
  home?: string;
  state?: string;
  config?: string;
  worktree?: string;
  directory?: string;
  data?: string;
};

type SnapshotReviewCleanupTargets = {
  sessionDiffFiles: string[];
  projectSnapshotDir?: string;
  appBackupDirs: string[];
};

type SnapshotReviewCleanupResult = {
  deletedPaths: string[];
  missingPaths: string[];
  failedPaths: Array<{ path: string; message: string }>;
};

function openCodeMessageCreatedAt(message: OpenCodeMessageEnvelope) {
  const time = openCodeInfo(message).time;
  return isPlainObject(time) && typeof time.created === 'number' ? toIsoTimestamp(time.created) : now();
}

function snapshotDiffsFromMessage(project: ProjectRecord, message: OpenCodeMessageEnvelope) {
  const summary = openCodeInfo(message).summary;
  if (!isPlainObject(summary)) return [];
  return openCodeArray<unknown>(summary.diffs)
    .map((diff) => normalizeSnapshotDiff(project, diff))
    .filter((diff): diff is SnapshotFileDiff => !!diff && !isIgnoredReviewPath(diff.file ?? ''));
}

function snapshotReviewId(sessionId: string, messageId: string, filePath: string) {
  return `${sessionId}:${messageId}:${filePath}`;
}

function snapshotReviewStatus(diff: SnapshotFileDiff) {
  return diff.status ?? 'modified';
}

function snapshotReviewRawDiff(diff: SnapshotFileDiff) {
  return patchBackupText(diff);
}

async function listOpenCodeProjectSessions(connection: ServerConnectionRecord | undefined) {
  const rawSessions = await openCodeJson<unknown>(
    `/session?${new URLSearchParams({ scope: 'project', limit: String(SNAPSHOT_REVIEW_SESSION_LIMIT) }).toString()}`,
    { method: 'GET' },
    connection,
    30000,
  );
  return openCodeArray<OpenCodeSessionRecord>(rawSessions)
    .filter((session) => typeof session.id === 'string' && session.id.trim())
    .sort((left, right) => {
      const leftUpdated = left.time?.updated ?? left.time?.created ?? 0;
      const rightUpdated = right.time?.updated ?? right.time?.created ?? 0;
      return rightUpdated - leftUpdated;
    });
}

function publicSnapshotReviewFile(file: SnapshotReviewFile) {
  const { rawDiff, ...publicFile } = file;
  void rawDiff;
  return publicFile;
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.trim())));
}

function isSafeOpenCodeId(value: string, prefix: string) {
  return new RegExp(`^${prefix}_[A-Za-z0-9]+$`).test(value);
}

export function inferOpenCodeDataDirectory(pathInfo: OpenCodePathInfo) {
  if (typeof pathInfo.data === 'string' && pathInfo.data.trim()) return path.resolve(pathInfo.data);
  if (typeof pathInfo.state === 'string' && pathInfo.state.trim()) {
    const statePath = path.resolve(pathInfo.state);
    const stateParent = path.basename(path.dirname(statePath)).toLowerCase() === 'state'
      ? path.dirname(path.dirname(statePath))
      : undefined;
    if (stateParent) return path.join(stateParent, 'share', 'opencode');
  }
  if (typeof pathInfo.home === 'string' && pathInfo.home.trim()) {
    return path.join(path.resolve(pathInfo.home), '.local', 'share', 'opencode');
  }
  return undefined;
}

export function buildSnapshotReviewCleanupTargets(input: {
  openCodeDataDir: string;
  projectId: string;
  sessionIds: string[];
  includeProjectSnapshot: boolean;
  stateDirectory?: string;
}): SnapshotReviewCleanupTargets {
  const openCodeDataDir = path.resolve(input.openCodeDataDir);
  const sessionDiffRoot = path.join(openCodeDataDir, 'storage', 'session_diff');
  const sessionDiffFiles = uniqueStrings(input.sessionIds)
    .filter((sessionId) => isSafeOpenCodeId(sessionId, 'ses'))
    .map((sessionId) => path.join(sessionDiffRoot, `${sessionId}.json`));
  return {
    sessionDiffFiles,
    projectSnapshotDir: input.includeProjectSnapshot && input.projectId.trim()
      ? path.join(openCodeDataDir, 'snapshot', input.projectId)
      : undefined,
    appBackupDirs: [],
  };
}

export function snapshotReviewRestoreTargets<T extends SnapshotReviewRestoreTarget>(files: T[]) {
  const targetsBySession = new Map<string, SnapshotReviewRestoreTarget>();
  for (const file of files) {
    if (!file.sessionId.trim() || !file.messageId.trim()) continue;
    const current = targetsBySession.get(file.sessionId);
    if (!current || file.messageCreatedAt.localeCompare(current.messageCreatedAt) < 0) {
      targetsBySession.set(file.sessionId, {
        sessionId: file.sessionId,
        messageId: file.messageId,
        messageCreatedAt: file.messageCreatedAt,
      });
    }
  }
  return [...targetsBySession.values()]
    .sort((left, right) => left.messageCreatedAt.localeCompare(right.messageCreatedAt));
}

async function restoreSnapshotReviewTargets(
  project: ProjectRecord,
  connection: ServerConnectionRecord | undefined,
  targets: SnapshotReviewRestoreTarget[],
) {
  const restored: SnapshotReviewRestoreTarget[] = [];
  const failed: Array<SnapshotReviewRestoreTarget & { message: string }> = [];
  const query = new URLSearchParams({ directory: project.rootPath });

  for (const target of targets) {
    try {
      await openCodeJson<unknown>(`/session/${encodeURIComponent(target.sessionId)}/revert?${query.toString()}`, {
        method: 'POST',
        body: JSON.stringify({ messageID: target.messageId }),
      }, connection, 30000);
      restored.push(target);
    } catch (error) {
      failed.push({
        ...target,
        message: error instanceof Error ? error.message : 'Unable to restore snapshot message',
      });
    }
  }

  return { restored, failed };
}

async function resolveOpenCodeDataDirectory(connection: ServerConnectionRecord | undefined) {
  const pathInfo = await openCodeJson<OpenCodePathInfo>('/path', { method: 'GET' }, connection, 10000);
  return inferOpenCodeDataDirectory(pathInfo);
}

function sessionDiffPath(openCodeDataDir: string, sessionId: string) {
  return path.join(openCodeDataDir, 'storage', 'session_diff', `${sessionId}.json`);
}

function projectSnapshotPath(openCodeDataDir: string, projectId: string) {
  return path.join(openCodeDataDir, 'snapshot', projectId);
}

async function removeSnapshotArtifact(root: string, targetPath: string, result: SnapshotReviewCleanupResult) {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(targetPath);
  if (!isInside(resolvedRoot, resolvedTarget)) {
    throw new ApiError(403, 'SNAPSHOT_CLEANUP_PATH_OUTSIDE_ROOT', 'Snapshot cleanup path escaped its allowed root');
  }
  if (!(await pathExists(resolvedTarget))) {
    result.missingPaths.push(resolvedTarget);
    return;
  }
  try {
    await fs.rm(resolvedTarget, { recursive: true, force: true });
    result.deletedPaths.push(resolvedTarget);
  } catch (error) {
    result.failedPaths.push({
      path: resolvedTarget,
      message: error instanceof Error ? error.message : 'Unable to delete snapshot artifact',
    });
  }
}

async function cleanupSnapshotReviewArtifacts(targets: SnapshotReviewCleanupTargets) {
  const result: SnapshotReviewCleanupResult = { deletedPaths: [], missingPaths: [], failedPaths: [] };
  const sessionDiffRoot = targets.sessionDiffFiles[0]
    ? path.dirname(targets.sessionDiffFiles[0])
    : undefined;

  if (sessionDiffRoot) {
    for (const targetPath of targets.sessionDiffFiles) {
      await removeSnapshotArtifact(sessionDiffRoot, targetPath, result);
    }
  }

  if (targets.projectSnapshotDir) {
    await removeSnapshotArtifact(path.dirname(targets.projectSnapshotDir), targets.projectSnapshotDir, result);
  }

  for (const targetPath of targets.appBackupDirs) {
    await removeSnapshotArtifact(path.dirname(targetPath), targetPath, result);
  }

  return result;
}

export function filterVisibleSnapshotReviewFiles<T extends { id: string }>(files: T[], dismissedIds: ReadonlySet<string>) {
  if (dismissedIds.size === 0) return files;
  return files.filter((file) => !dismissedIds.has(file.id));
}

function snapshotReviewDismissedIds(state: AppStateStore, project: ProjectRecord) {
  return new Set(state.snapshotReviewDismissals[project.id] ?? []);
}

function snapshotReviewSummary(files: SnapshotReviewFile[]) {
  return {
    total: files.length,
    modified: files.filter((file) => file.status === 'modified').length,
    deleted: files.filter((file) => file.status === 'deleted').length,
    added: files.filter((file) => file.status === 'added').length,
    untracked: 0,
    highRisk: files.filter((file) => file.riskLevel === 'high' || file.riskLevel === 'critical').length,
  };
}

async function collectSnapshotReview(project: ProjectRecord, connection: ServerConnectionRecord | undefined) {
  await ensureOpenCodeServer(connection);
  const openCodeDataDir = await resolveOpenCodeDataDirectory(connection).catch(() => undefined);
  if (openCodeDataDir && !(await pathExists(projectSnapshotPath(openCodeDataDir, project.id)))) {
    return [];
  }
  const sessions = await listOpenCodeProjectSessions(connection);
  const files: SnapshotReviewFile[] = [];
  let remoteDiffLookups = 0;

  for (const session of sessions) {
    if (!session.id) continue;
    if (openCodeDataDir && !(await pathExists(sessionDiffPath(openCodeDataDir, session.id)))) continue;
    const messages = await listOpenCodeSessionMessages(connection, session.id).catch(() => []);
    const userMessages = messages
      .filter((message) => openCodeMessageRole(message) === 'user' && openCodeMessageId(message))
      .reverse();

    for (const message of userMessages) {
      const messageId = openCodeMessageId(message);
      if (!messageId) continue;

      let diffs = snapshotDiffsFromMessage(project, message);
      if (diffs.length === 0 && remoteDiffLookups < SNAPSHOT_REVIEW_REMOTE_DIFF_LIMIT) {
        remoteDiffLookups += 1;
        diffs = await fetchOpenCodeSnapshotDiffs(project, connection, session.id, messageId).catch(() => []);
      }
      if (diffs.length === 0) continue;

      const messageCreatedAt = openCodeMessageCreatedAt(message);
      for (const diff of diffs) {
        if (!diff.file) continue;
        const rawDiff = snapshotReviewRawDiff(diff);
        files.push({
          id: snapshotReviewId(session.id, messageId, diff.file),
          path: diff.file,
          status: snapshotReviewStatus(diff),
          statusCode: 'snapshot',
          riskLevel: riskFromContent('snapshot.change', diff.file, rawDiff),
          backupEligible: true,
          diff: truncateReviewDiff(rawDiff),
          rawDiff,
          warnings: detectSecrets(rawDiff),
          sessionId: session.id,
          sessionTitle: session.title ?? 'Untitled session',
          messageId,
          messageCreatedAt,
          additions: diff.additions ?? 0,
          deletions: diff.deletions ?? 0,
        });
      }
    }
  }

  return files.sort((left, right) => right.messageCreatedAt.localeCompare(left.messageCreatedAt));
}

async function writeSnapshotReviewPatch(file: SnapshotReviewFile, patchRoot: string) {
  const patchPath = ensureBackupDestination(patchRoot, `${file.path}.patch`);
  await fs.mkdir(path.dirname(patchPath), { recursive: true });
  await fs.writeFile(patchPath, redactSecrets(file.rawDiff), 'utf8');
  return patchPath;
}

export async function reviewWorkingTreeChanges(projectId: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);
  const files = filterVisibleSnapshotReviewFiles(
    await collectSnapshotReview(project, connection),
    snapshotReviewDismissedIds(state, project),
  );
  return {
    projectId: project.id,
    generatedAt: now(),
    source: 'opencode_snapshot',
    files: files.map(publicSnapshotReviewFile),
    summary: snapshotReviewSummary(files),
  };
}

export async function clearSnapshotReviewChanges(projectId: string, input: { snapshotIds?: string[] } = {}) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);
  const dismissedIds = snapshotReviewDismissedIds(state, project);
  const visibleFiles = filterVisibleSnapshotReviewFiles(await collectSnapshotReview(project, connection), dismissedIds);
  const requestedIds = new Set((input.snapshotIds ?? []).filter(Boolean));
  const filesToClear = requestedIds.size > 0
    ? visibleFiles.filter((file) => requestedIds.has(file.id))
    : visibleFiles;
  const clearsAllVisible = filesToClear.length > 0 && filesToClear.length === visibleFiles.length;

  for (const file of filesToClear) {
    dismissedIds.add(file.id);
  }

  const openCodeDataDir = await resolveOpenCodeDataDirectory(connection).catch(() => undefined);
  const cleanup = openCodeDataDir
    ? await cleanupSnapshotReviewArtifacts(buildSnapshotReviewCleanupTargets({
      openCodeDataDir,
      projectId: project.id,
      sessionIds: filesToClear.map((file) => file.sessionId),
      includeProjectSnapshot: clearsAllVisible,
      stateDirectory: getStateDirectory(),
    }))
    : { deletedPaths: [], missingPaths: [], failedPaths: [{ path: 'opencode:/path', message: 'Unable to resolve OpenCode data directory' }] };
  if (cleanup.failedPaths.length > 0) {
    throw new ApiError(500, 'SNAPSHOT_CLEANUP_FAILED', 'One or more snapshot artifacts could not be deleted', cleanup);
  }

  state.snapshotReviewDismissals = {
    ...state.snapshotReviewDismissals,
    [project.id]: [...dismissedIds],
  };

  const createdAt = now();
  state.auditLogs.unshift({
    id: makeId('audit'),
    actor: 'local-user',
    action: 'snapshot_review.clear',
    targetType: 'snapshot',
    targetId: project.id,
    metadata: {
      cleared: filesToClear.length,
      snapshotIds: filesToClear.map((file) => file.id),
      deletedPaths: cleanup.deletedPaths,
      missingPaths: cleanup.missingPaths,
      failedPaths: cleanup.failedPaths,
    },
    createdAt,
  });
  await saveState(state);

  return {
    projectId: project.id,
    cleared: filesToClear.length,
    snapshotIds: filesToClear.map((file) => file.id),
    cleanup,
    generatedAt: createdAt,
  };
}

export async function backupWorkingTreeChanges(projectId: string, input: { paths?: string[]; snapshotIds?: string[]; restore?: boolean }) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = getDefaultServerConnection(state, project);
  const reviewFiles = filterVisibleSnapshotReviewFiles(
    await collectSnapshotReview(project, connection),
    snapshotReviewDismissedIds(state, project),
  );
  const requestedSnapshotIds = new Set((input.snapshotIds ?? []).filter(Boolean));
  const requestedPaths = new Set((input.paths ?? []).map(normalizeProjectFilePath));
  const selectedFiles = reviewFiles.filter((file) => {
    if (requestedSnapshotIds.size > 0) return requestedSnapshotIds.has(file.id);
    if (requestedPaths.size > 0) return requestedPaths.has(file.path) || requestedPaths.has(file.id);
    return true;
  });

  if (selectedFiles.length === 0) {
    throw new ApiError(400, 'NO_SNAPSHOT_FILES_SELECTED', 'No OpenCode snapshot files were selected for backup');
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupRoot = path.join(getStateDirectory(), 'manual-backups', `snapshot-review-${timestamp}`);
  const currentRoot = path.join(backupRoot, 'current-working-tree');
  const headRoot = path.join(backupRoot, 'git-head-original');
  const patchRoot = path.join(backupRoot, 'snapshot-patches');
  await fs.mkdir(currentRoot, { recursive: true });
  await fs.mkdir(headRoot, { recursive: true });
  await fs.mkdir(patchRoot, { recursive: true });

  const backups = [];
  for (const file of selectedFiles) {
    const currentBackupPath = await copyWorkingTreeSnapshot(project, file.path, currentRoot);
    const headBackupPath = await copyHeadSnapshot(project, file.path, headRoot);
    const patchBackupPath = await writeSnapshotReviewPatch(file, patchRoot);
    backups.push({
      id: makeId('bak'),
      snapshotId: file.id,
      filePath: file.path,
      status: file.status,
      riskLevel: file.riskLevel,
      sessionId: file.sessionId,
      messageId: file.messageId,
      additions: file.additions,
      deletions: file.deletions,
      currentBackupPath,
      patchBackupPath,
      headBackupPath,
    });
  }

  const restore = input.restore
    ? await restoreSnapshotReviewTargets(project, connection, snapshotReviewRestoreTargets(selectedFiles))
    : undefined;

  await fs.writeFile(path.join(backupRoot, 'README.txt'), [
    'Manual backup created from OpenCode snapshot Review changes.',
    `Created: ${new Date().toISOString()}`,
    `Project: ${project.rootPath}`,
    input.restore
      ? `Restore: ${restore?.restored.length ?? 0} message(s) restored, ${restore?.failed.length ?? 0} failed`
      : 'Restore: not requested',
    '',
    'Files:',
    ...backups.map((backup) => `- ${backup.status} ${backup.filePath} (${backup.sessionId}/${backup.messageId})`),
    '',
  ].join('\n'), 'utf8');

  state.auditLogs.unshift({
    id: makeId('audit'),
    actor: 'local-user',
    action: 'backup.snapshot_review',
    targetType: 'snapshot',
    targetId: project.id,
    metadata: {
      backupRoot,
      fileCount: backups.length,
      files: backups.map((backup) => backup.filePath),
      snapshotIds: backups.map((backup) => backup.snapshotId),
      restore,
    },
    createdAt: now(),
  });
  await saveState(state);

  return {
    backupRoot,
    createdAt: now(),
    backups,
    restore,
  };
}
