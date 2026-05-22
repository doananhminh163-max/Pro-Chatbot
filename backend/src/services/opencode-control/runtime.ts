import 'dotenv/config';
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, promises as fs, readFileSync } from 'node:fs';
import path from 'node:path';
import { stripJsonComments } from './config-file.js';
import { ApiError } from './errors.js';

const DEFAULT_OPENCODE_HOSTNAME = '127.0.0.1';
const DEFAULT_OPENCODE_PORT = 4096;
const OPENCODE_STARTUP_TIMEOUT_MS = 15000;
const DEFAULT_OPENCODE_CORS = ['http://localhost:5173', 'http://127.0.0.1:5173'];

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

export type OpenCodePart = {
  type?: string;
  text?: string;
  content?: unknown;
  [key: string]: unknown;
};

export type OpenCodeSessionResponse = {
  id?: string;
  title?: string;
  [key: string]: unknown;
};

export type OpenCodeMessageResponse = {
  info?: Record<string, unknown>;
  parts?: OpenCodePart[];
  [key: string]: unknown;
};

let managedOpenCodeProcess: ChildProcess | null = null;
let onlineHealthCache: { baseUrl: string; version: string; expiresAt: number } | null = null;

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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readProjectOpenCodeConfig() {
  const root = resolveWorkspaceRoot();
  for (const filename of ['opencode.json', 'opencode.jsonc']) {
    const targetPath = path.join(root, filename);
    if (!existsSync(targetPath)) continue;
    try {
      return JSON.parse(stripJsonComments(readFileSync(targetPath, 'utf8'))) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return {};
}

function readProjectServerConfig() {
  const config = readProjectOpenCodeConfig();
  const server = config.server && typeof config.server === 'object' && !Array.isArray(config.server)
    ? config.server as Record<string, unknown>
    : {};
  const hostname = typeof server.hostname === 'string' && server.hostname.trim()
    ? server.hostname.trim()
    : DEFAULT_OPENCODE_HOSTNAME;
  const port = Number(server.port) || DEFAULT_OPENCODE_PORT;
  const cors = Array.isArray(server.cors)
    ? server.cors.filter((origin): origin is string => typeof origin === 'string' && origin.trim().length > 0)
    : DEFAULT_OPENCODE_CORS;

  return { hostname, port, cors };
}

function connectHostname(hostname: string) {
  if (hostname === '0.0.0.0' || hostname === '::') return DEFAULT_OPENCODE_HOSTNAME;
  return hostname;
}

function sanitizeOpenCodeChildEnv() {
  const childEnv = { ...process.env };
  delete childEnv.OPENCODE_SERVER_URL;
  delete childEnv.OPENCODE_SERVER_PORT;
  delete childEnv.OPENCODE_SERVER_USERNAME;
  delete childEnv.OPENCODE_SERVER_PASSWORD;
  delete childEnv.OPENCODE_SERVER_TOKEN;
  return childEnv;
}

export function getDefaultOpenCodeBaseUrl() {
  const server = readProjectServerConfig();
  const hostname = connectHostname(server.hostname);
  const host = hostname.includes(':') && !hostname.startsWith('[') ? `[${hostname}]` : hostname;
  return `http://${host}:${server.port}`;
}

function getOpenCodeBaseUrl(connection?: ServerConnectionRecord) {
  return (connection?.baseUrl ?? getDefaultOpenCodeBaseUrl()).replace(/\/$/, '');
}

function getOpenCodeServeTarget(baseUrl = getDefaultOpenCodeBaseUrl()) {
  try {
    const url = new URL(baseUrl);
    return {
      hostname: url.hostname || DEFAULT_OPENCODE_HOSTNAME,
      port: Number(url.port) || DEFAULT_OPENCODE_PORT,
    };
  } catch {
    return {
      hostname: DEFAULT_OPENCODE_HOSTNAME,
      port: readProjectServerConfig().port,
    };
  }
}

function canStartLocalOpenCodeServer(baseUrl: string) {
  try {
    const hostname = new URL(baseUrl).hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '0.0.0.0';
  } catch {
    return true;
  }
}

function getOpenCodeSpawnCommand() {
  if (process.platform !== 'win32') {
    return { command: 'opencode', prefixArgs: [] as string[] };
  }

  const appData = process.env.APPDATA;
  const windowsBinaryPath = appData ? path.join(appData, 'npm', 'node_modules', 'opencode-windows-x64', 'bin', 'opencode.exe') : '';
  if (windowsBinaryPath && existsSync(windowsBinaryPath)) {
    return { command: windowsBinaryPath, prefixArgs: [] as string[] };
  }

  const scriptPath = appData ? path.join(appData, 'npm', 'node_modules', 'opencode-ai', 'bin', 'opencode') : '';
  if (scriptPath && existsSync(scriptPath)) {
    return { command: process.execPath, prefixArgs: [scriptPath] };
  }

  return { command: 'opencode.cmd', prefixArgs: [] as string[] };
}

async function resolveSecretRef(ref?: string) {
  if (!ref) return undefined;
  const match = ref.match(/^\{(env|file):([^}]+)\}$/);
  if (!match) return undefined;
  const [, source, key] = match;
  if (source === 'env') {
    return process.env[key];
  }
  const filePath = path.isAbsolute(key) ? key : path.resolve(resolveWorkspaceRoot(), key);
  return fs.readFile(filePath, 'utf8').then((value) => value.trim()).catch(() => undefined);
}

async function buildOpenCodeHeaders(connection?: ServerConnectionRecord, extra?: HeadersInit) {
  const headers = new Headers(extra);
  if (headers.has('Authorization')) return headers;

  if (connection?.authMode === 'token') {
    const token = await resolveSecretRef(connection.passwordRef);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  const password = await resolveSecretRef(connection?.passwordRef);
  if (password) {
    const username = connection?.username ?? 'opencode';
    headers.set('Authorization', `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`);
  }
  return headers;
}

export async function openCodeFetch(pathname: string, options: RequestInit = {}, connection?: ServerConnectionRecord, timeoutMs = 30000) {
  const baseUrl = getOpenCodeBaseUrl(connection);
  const headers = await buildOpenCodeHeaders(connection, options.headers);
  const url = pathname.startsWith('http') ? pathname : `${baseUrl}${pathname}`;
  const response = await fetch(url, {
    ...options,
    headers,
    signal: options.signal ?? AbortSignal.timeout(timeoutMs),
  });

  if (response.status === 401) {
    throw new ApiError(
      502,
      'OPENCODE_AUTH_FAILED',
      'OpenCode server requires authentication. Stop the old server and restart it with the project opencode.json configuration.',
      { baseUrl },
    );
  }

  return response;
}

export async function openCodeJson<T>(pathname: string, options: RequestInit = {}, connection?: ServerConnectionRecord, timeoutMs = 30000): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const response = await openCodeFetch(pathname, { ...options, headers }, connection, timeoutMs);
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new ApiError(502, 'OPENCODE_CONNECTION_FAILED', `OpenCode request failed with HTTP ${response.status}`, {
      path: pathname,
      detail: detail.slice(0, 2000),
    });
  }
  return response.json() as Promise<T>;
}

async function openCodeText(pathname: string, options: RequestInit = {}, connection?: ServerConnectionRecord, timeoutMs = 30000) {
  const response = await openCodeFetch(pathname, options, connection, timeoutMs);
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new ApiError(502, 'OPENCODE_CONNECTION_FAILED', `OpenCode request failed with HTTP ${response.status}`, {
      path: pathname,
      detail: detail.slice(0, 2000),
    });
  }
  return response.text();
}

export async function checkOpenCodeHealth(connection?: ServerConnectionRecord, timeoutMs = 2500) {
  const baseUrl = getOpenCodeBaseUrl(connection);
  try {
    const response = await openCodeFetch('/global/health', { method: 'GET' }, connection, timeoutMs);
    if (response.status === 401) {
      return { status: 'unauthorized', baseUrl, version: 'unknown' };
    }
    if (!response.ok) {
      return { status: `http_${response.status}`, baseUrl, version: 'unknown' };
    }
    const body = await response.json().catch(() => ({})) as { version?: unknown };
    const version = typeof body.version === 'string' ? body.version : 'unknown';
    return { status: 'online', baseUrl, version };
  } catch (error) {
    if (error instanceof ApiError && error.code === 'OPENCODE_AUTH_FAILED') {
      return { status: 'unauthorized', baseUrl, version: 'unknown' };
    }
    return { status: 'offline', baseUrl, version: 'unknown' };
  }
}

function startOpenCodeServer(baseUrl = getDefaultOpenCodeBaseUrl()) {
  if (managedOpenCodeProcess && !managedOpenCodeProcess.killed) {
    return;
  }

  const spawnTarget = getOpenCodeSpawnCommand();
  managedOpenCodeProcess = spawn(spawnTarget.command, [
    ...spawnTarget.prefixArgs,
    'serve',
  ], {
    cwd: resolveWorkspaceRoot(),
    env: sanitizeOpenCodeChildEnv(),
    stdio: 'ignore',
    windowsHide: true,
  });

  managedOpenCodeProcess.on('exit', () => {
    managedOpenCodeProcess = null;
  });
  managedOpenCodeProcess.on('error', (error) => {
    console.error('Failed to start OpenCode server', error);
    managedOpenCodeProcess = null;
  });
}

export async function ensureOpenCodeServer(connection?: ServerConnectionRecord) {
  const baseUrl = getOpenCodeBaseUrl(connection);
  if (onlineHealthCache?.baseUrl === baseUrl && onlineHealthCache.expiresAt > Date.now()) {
    return { status: 'online', baseUrl, version: onlineHealthCache.version };
  }

  const initialHealth = await checkOpenCodeHealth(connection);
  if (initialHealth.status === 'online') {
    onlineHealthCache = {
      baseUrl: initialHealth.baseUrl,
      version: initialHealth.version,
      expiresAt: Date.now() + 1500,
    };
    return initialHealth;
  }
  if (initialHealth.status === 'unauthorized') {
    throw new ApiError(
      502,
      'OPENCODE_AUTH_FAILED',
      'OpenCode server requires authentication. Stop the old server and restart it with the project opencode.json configuration.',
      { baseUrl: initialHealth.baseUrl },
    );
  }

  if (!canStartLocalOpenCodeServer(initialHealth.baseUrl)) {
    throw new ApiError(
      502,
      'OPENCODE_CONNECTION_FAILED',
      'OpenCode server is offline and the configured URL is not a local server the backend can start.',
      { baseUrl: initialHealth.baseUrl },
    );
  }

  startOpenCodeServer(initialHealth.baseUrl);
  const deadline = Date.now() + OPENCODE_STARTUP_TIMEOUT_MS;
  while (Date.now() < deadline) {
    await delay(500);
    const nextHealth = await checkOpenCodeHealth(connection, 1500);
    if (nextHealth.status === 'online') {
      onlineHealthCache = {
        baseUrl: nextHealth.baseUrl,
        version: nextHealth.version,
        expiresAt: Date.now() + 1500,
      };
      return nextHealth;
    }
    if (nextHealth.status === 'unauthorized') {
      throw new ApiError(
        502,
        'OPENCODE_AUTH_FAILED',
        'OpenCode server started but requires authentication. Check that the OpenCode process is not receiving server auth environment variables.',
        { baseUrl: nextHealth.baseUrl },
      );
    }
  }

  throw new ApiError(
    502,
    'OPENCODE_CONNECTION_FAILED',
    'OpenCode server is offline and could not be started on the configured local port.',
    { baseUrl: initialHealth.baseUrl },
  );
}

export async function restartOpenCodeServer(connection?: ServerConnectionRecord) {
  const health = await ensureOpenCodeServer(connection);
  onlineHealthCache = null;
  await openCodeText('/global/dispose', { method: 'POST' }, connection, 10000);
  const deadline = Date.now() + OPENCODE_STARTUP_TIMEOUT_MS;

  while (Date.now() < deadline) {
    await delay(500);
    const nextHealth = await checkOpenCodeHealth(connection, 2000);
    if (nextHealth.status === 'online') {
      return {
        before: health,
        after: nextHealth,
        method: 'global.dispose',
      };
    }
  }

  throw new ApiError(
    502,
    'OPENCODE_RESTART_FAILED',
    'OpenCode server did not become healthy after dispose/reload.',
    { baseUrl: health.baseUrl },
  );
}
