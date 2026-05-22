import 'dotenv/config';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const NODE_ENV = process.env.NODE_ENV ?? 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

function readOpenCodeServerUrl() {
  const root = resolveWorkspaceRoot();
  for (const filename of ['opencode.json', 'opencode.jsonc']) {
    const targetPath = path.join(root, filename);
    if (!existsSync(targetPath)) continue;
    try {
      const config = JSON.parse(readFileSync(targetPath, 'utf8').replace(/,\s*([}\]])/g, '$1')) as Record<string, unknown>;
      const server = config.server && typeof config.server === 'object' && !Array.isArray(config.server)
        ? config.server as Record<string, unknown>
        : {};
      const rawHostname = typeof server.hostname === 'string' && server.hostname.trim() ? server.hostname.trim() : '127.0.0.1';
      const hostname = rawHostname === '0.0.0.0' || rawHostname === '::' ? '127.0.0.1' : rawHostname;
      const host = hostname.includes(':') && !hostname.startsWith('[') ? `[${hostname}]` : hostname;
      const port = Number(server.port) || 4096;
      return `http://${host}:${port}`;
    } catch {
      return 'http://127.0.0.1:4096';
    }
  }
  return 'http://127.0.0.1:4096';
}

export const DEFAULT_OPENCODE_SERVER_URL = readOpenCodeServerUrl();
export const DEFAULT_OPENCODE_USERNAME = 'opencode';
export const OPENCODE_PASSWORD_REF = undefined;

export const SECRET_REF_PATTERN = /^\{(env|file):[^}]+\}$/;

export function resolveWorkspaceRoot() {
  if (process.env.PROJECT_ROOT) {
    return path.resolve(process.env.PROJECT_ROOT);
  }

  const current = process.cwd();
  if (path.basename(current).toLowerCase() === 'backend') {
    return path.dirname(current);
  }

  return current;
}
