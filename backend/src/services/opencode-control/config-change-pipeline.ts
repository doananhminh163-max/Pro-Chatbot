import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ApiError } from './errors.js';
import { parseJsonc, readJsonc, stringifyConfig } from './config-file.js';
import { ensureOpenCodeServer, openCodeJson, restartOpenCodeServer } from './runtime.js';
import type { AppStateStore, ConfigBackupRecord, ConfigChangeRecord, ProjectRecord, RiskLevel } from './types.js';
import { getStateDirectory, makeId, now, pathExists, readText, writeAtomic } from './utils.js';
import { assertProject, getDefaultServerConnection, loadState, resolveProjectPath, saveState, toProjectRelative } from './state-store.js';

const JSON_CONFIG_EXTENSIONS = new Set(['.json', '.jsonc']);
const OPENCODE_RESTART_CHANGE_PREFIXES = ['agent.', 'skill.', 'mcp.'];

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

export function redactSecrets(input: string) {
  return input
    .replace(/("(?:apiKey|api_key|token|password|secret|clientSecret|client_secret)"\s*:\s*)"[^"]*"/gi, '$1"[REDACTED]"')
    .replace(/((?:API_KEY|TOKEN|PASSWORD|SECRET|CLIENT_SECRET)\s*=\s*).+/gi, '$1[REDACTED]');
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

export function detectSecrets(content: string) {
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

export function riskFromContent(type: string, targetFile: string, content: string, patch?: unknown): RiskLevel {
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

function shouldRestartOpenCodeForChange(type: string) {
  return OPENCODE_RESTART_CHANGE_PREFIXES.some((prefix) => type.startsWith(prefix));
}

export async function restartOpenCodeForProject(project: ProjectRecord) {
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

export async function createFileChange(input: {
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

export async function createConfigPatchChange(input: {
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

  if (JSON_CONFIG_EXTENSIONS.has(path.extname(targetPath).toLowerCase())) {
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
