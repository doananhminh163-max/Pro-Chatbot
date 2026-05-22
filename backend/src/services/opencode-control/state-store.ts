import os from 'node:os';
import path from 'node:path';
import { getDefaultOpenCodeBaseUrl, openCodeJson } from './runtime.js';
import { ApiError } from './errors.js';
import type { AppStateStore, ProjectRecord, ServerConnectionRecord } from './types.js';
import { now, pathExists, resolveWorkspaceRoot, stableId } from './utils.js';

type OpenCodeProjectResponse = {
  id?: string;
  name?: string;
  worktree?: string;
  time?: {
    created?: number;
    updated?: number;
  };
};

type VolatileState = Pick<
  AppStateStore,
  'configChanges' | 'backups' | 'marketplaceSkills' | 'skillOverrides' | 'snapshotReviewDismissals' | 'auditLogs'
>;

const VERSION = 1;

const volatileState: VolatileState = {
  configChanges: [],
  backups: [],
  marketplaceSkills: [],
  skillOverrides: {},
  snapshotReviewDismissals: {},
  auditLogs: [],
};

export function getDefaultServerConnection(state: AppStateStore, project: ProjectRecord) {
  return state.serverConnections.find((connection) => connection.projectId === project.id && connection.isDefault)
    ?? state.serverConnections.find((connection) => connection.projectId === project.id);
}

export async function loadState(root = resolveWorkspaceRoot()): Promise<AppStateStore> {
  const project = await buildProjectRecord(root);
  return {
    version: VERSION,
    projects: [project],
    serverConnections: [buildDefaultServerConnection(project)],
    configChanges: [...volatileState.configChanges],
    backups: [...volatileState.backups],
    marketplaceSkills: [...volatileState.marketplaceSkills],
    skillOverrides: { ...volatileState.skillOverrides },
    snapshotReviewDismissals: cloneSnapshotReviewDismissals(volatileState.snapshotReviewDismissals),
    chatSessions: [],
    chatMessages: [],
    auditLogs: [...volatileState.auditLogs],
  };
}

export async function saveState(state: AppStateStore) {
  volatileState.configChanges = uniqueBy(state.configChanges, (change) => change.id);
  volatileState.backups = uniqueBy(state.backups, (backup) => backup.id);
  volatileState.marketplaceSkills = uniqueBy(state.marketplaceSkills, (skill) => skill.id);
  volatileState.skillOverrides = sanitizeSkillOverrides(state.skillOverrides);
  volatileState.snapshotReviewDismissals = sanitizeSnapshotReviewDismissals(state.snapshotReviewDismissals);
  volatileState.auditLogs = uniqueBy(state.auditLogs, (log) => log.id);
}

export async function buildProjectRecord(root: string): Promise<ProjectRecord> {
  const configPath = await findProjectConfigPath(root);
  const tuiConfigPath = path.join(root, 'tui.json');
  const remoteProject = await readCurrentOpenCodeProject().catch(() => null);
  const worktree = remoteProject?.worktree ? path.resolve(remoteProject.worktree) : root;
  const projectRoot = path.resolve(worktree);
  return {
    id: remoteProject?.id ?? stableId('prj', projectRoot.toLowerCase()),
    name: remoteProject?.name?.trim() || path.basename(projectRoot),
    rootPath: projectRoot,
    configPath,
    tuiConfigPath: await pathExists(tuiConfigPath) ? tuiConfigPath : null,
    platform: `${os.platform()} ${os.arch()}`,
    createdAt: toIso(remoteProject?.time?.created),
    updatedAt: toIso(remoteProject?.time?.updated),
  };
}

export async function findProjectConfigPath(root: string) {
  const candidates = [path.join(root, 'opencode.json'), path.join(root, 'opencode.jsonc')];
  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return candidate;
    }
  }
  return null;
}

export function assertProject(state: AppStateStore, projectId?: string) {
  if (!projectId || projectId === 'current' || projectId === 'default') {
    return state.projects[0];
  }

  const project = state.projects.find((item) => item.id === projectId);
  if (!project) {
    throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found');
  }
  return project;
}

export function isInside(parent: string, child: string) {
  const relative = path.relative(parent, child);
  return relative === '' || (!!relative && !relative.startsWith('..') && !path.isAbsolute(relative));
}

export function resolveProjectPath(project: ProjectRecord, requestedPath: string, options: { allowMissing?: boolean } = {}) {
  const absolutePath = path.isAbsolute(requestedPath)
    ? path.resolve(requestedPath)
    : path.resolve(project.rootPath, requestedPath);

  if (!isInside(project.rootPath, absolutePath)) {
    throw new ApiError(403, 'PATH_OUTSIDE_PROJECT', 'Path is outside the project root');
  }

  if (!options.allowMissing) {
    return absolutePath;
  }

  return absolutePath;
}

export function toProjectRelative(project: ProjectRecord, absolutePath: string) {
  const relative = path.relative(project.rootPath, absolutePath);
  return relative || path.basename(absolutePath);
}

async function readCurrentOpenCodeProject() {
  return openCodeJson<OpenCodeProjectResponse>('/project/current', { method: 'GET' }, undefined, 5000);
}

function buildDefaultServerConnection(project: ProjectRecord): ServerConnectionRecord {
  const timestamp = now();
  return {
    id: stableId('srv', getDefaultOpenCodeBaseUrl()),
    projectId: project.id,
    baseUrl: getDefaultOpenCodeBaseUrl(),
    authMode: 'none',
    isDefault: true,
    status: 'unknown',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function toIso(timestamp?: number) {
  return timestamp ? new Date(timestamp).toISOString() : now();
}

function uniqueBy<T>(items: T[], key: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const value = key(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function sanitizeSkillOverrides(overrides: AppStateStore['skillOverrides']) {
  return Object.fromEntries(
    Object.entries(overrides ?? {})
      .filter(([sourcePath]) => sourcePath.trim())
      .map(([sourcePath, override]) => [sourcePath, { status: override?.status }]),
  );
}

function cloneSnapshotReviewDismissals(dismissals: AppStateStore['snapshotReviewDismissals']) {
  return Object.fromEntries(
    Object.entries(dismissals ?? {}).map(([projectId, snapshotIds]) => [projectId, [...snapshotIds]]),
  );
}

function sanitizeSnapshotReviewDismissals(dismissals: AppStateStore['snapshotReviewDismissals']) {
  return Object.fromEntries(
    Object.entries(dismissals ?? {})
      .filter(([projectId]) => projectId.trim())
      .map(([projectId, snapshotIds]) => [
        projectId,
        Array.from(new Set((snapshotIds ?? []).filter((snapshotId) => typeof snapshotId === 'string' && snapshotId.trim()))),
      ]),
  );
}
