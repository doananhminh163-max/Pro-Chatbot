import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ApiError } from './errors.js';
import { readJsonc } from './config-file.js';
import { responsePage } from './pagination.js';
import { checkOpenCodeHealth, ensureOpenCodeServer, openCodeJson } from './runtime.js';
import {
  assertProject,
  buildProjectRecord,
  findProjectConfigPath,
  loadState,
  saveState,
} from './state-store.js';
import type { ServerConnectionRecord } from './types.js';
import { makeId, now, pathExists } from './utils.js';

export async function listProjects(query: { q?: string; page?: number; pageSize?: number }) {
  const state = await loadState();
  const current = state.projects[0];
  let projects = state.projects;
  try {
    await ensureOpenCodeServer();
    const remoteProjects = await openCodeJson<Array<{
      id?: string;
      name?: string;
      worktree?: string;
      time?: { created?: number; updated?: number };
    }>>('/project', { method: 'GET' }, undefined, 10000);
    projects = remoteProjects.map((project) => ({
      id: project.id ?? current.id,
      name: project.name?.trim() || path.basename(project.worktree ?? current.rootPath),
      rootPath: project.worktree ?? current.rootPath,
      configPath: project.worktree === current.rootPath ? current.configPath : null,
      tuiConfigPath: project.worktree === current.rootPath ? current.tuiConfigPath : null,
      platform: current.platform,
      createdAt: project.time?.created ? new Date(project.time.created).toISOString() : current.createdAt,
      updatedAt: project.time?.updated ? new Date(project.time.updated).toISOString() : current.updatedAt,
    }));
  } catch {
    projects = state.projects;
  }
  const q = query.q?.trim().toLowerCase();
  const filtered = q
    ? projects.filter((project) => project.name.toLowerCase().includes(q) || project.rootPath.toLowerCase().includes(q))
    : projects;
  return responsePage(filtered, query.page, query.pageSize);
}

export async function createProject(input: { name?: string; rootPath: string }) {
  const rootPath = path.resolve(input.rootPath);
  const stat = await fs.stat(rootPath).catch(() => null);
  if (!stat?.isDirectory()) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'rootPath must be an existing directory');
  }
  throw new ApiError(
    405,
    'PROJECT_MUTATION_UNSUPPORTED',
    'Projects are managed by the OpenCode server. Open the directory in OpenCode instead of creating a local database record.',
    { rootPath },
  );
}

export async function deleteProject(projectId: string) {
  throw new ApiError(
    405,
    'PROJECT_MUTATION_UNSUPPORTED',
    'Projects are managed by the OpenCode server and cannot be deleted from this UI.',
    { projectId },
  );
}

export async function getProjectStatus(projectId: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const configPath = await findProjectConfigPath(project.rootPath);
  const tuiPath = path.join(project.rootPath, 'tui.json');
  const configValid = configPath ? await readJsonc(configPath).then(() => true).catch(() => false) : null;
  const tuiValid = await pathExists(tuiPath) ? await readJsonc(tuiPath).then(() => true).catch(() => false) : null;
  const defaultConnection = state.serverConnections.find((connection) => connection.projectId === project.id && connection.isDefault);

  return {
    projectId: project.id,
    config: {
      exists: !!configPath,
      path: configPath,
      valid: configValid,
    },
    tuiConfig: {
      exists: tuiValid !== null,
      path: tuiValid !== null ? tuiPath : null,
      valid: tuiValid,
    },
    openCodeServer: {
      status: defaultConnection?.status ?? 'unknown',
      baseUrl: defaultConnection?.baseUrl ?? null,
      lastCheckedAt: defaultConnection?.lastCheckedAt ?? null,
    },
  };
}

export async function listServerConnections(projectId: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  return state.serverConnections.filter((connection) => connection.projectId === project.id);
}

export async function createServerConnection(projectId: string, input: Partial<ServerConnectionRecord>) {
  void input;
  assertProject(await loadState(), projectId);
  throw new ApiError(
    405,
    'SERVER_CONNECTION_MUTATION_UNSUPPORTED',
    'The OpenCode server connection is configured through opencode.json, not stored in a local database.',
  );
}

export async function testServerConnection(projectId: string, connectionId: string) {
  const state = await loadState();
  const project = assertProject(state, projectId);
  const connection = state.serverConnections.find((item) => item.projectId === project.id && item.id === connectionId);
  if (!connection) {
    throw new ApiError(404, 'SERVER_CONNECTION_NOT_FOUND', 'Server connection not found');
  }

  const startedAt = Date.now();
  const health = await checkOpenCodeHealth(connection);
  if (health.status === 'unauthorized') {
    throw new ApiError(
      502,
      'OPENCODE_AUTH_FAILED',
      'OpenCode server requires authentication. Stop the old server and restart it with the project opencode.json configuration.',
      { baseUrl: connection.baseUrl },
    );
  }
  try {
    connection.status = health.status;
    connection.lastCheckedAt = now();
    connection.updatedAt = now();
    await saveState(state);
    return {
      status: connection.status,
      baseUrl: connection.baseUrl,
      latencyMs: Date.now() - startedAt,
      serverInfo: { version: health.version },
    };
  } catch {
    connection.status = 'offline';
    connection.lastCheckedAt = now();
    connection.updatedAt = now();
    await saveState(state);
    return {
      status: 'offline',
      baseUrl: connection.baseUrl,
      latencyMs: Date.now() - startedAt,
      serverInfo: { version: 'unknown' },
    };
  }
}
