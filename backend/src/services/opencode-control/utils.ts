import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export function now() {
  return new Date().toISOString();
}

export function makeId(prefix: string) {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
}

export function stableId(prefix: string, value: string) {
  return `${prefix}_${crypto.createHash('sha1').update(value).digest('hex').slice(0, 10)}`;
}

export function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

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

export function getStateDirectory(root = resolveWorkspaceRoot()) {
  return path.join(root, '.pro-chatbot');
}

export async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function readText(targetPath: string, maxLength?: number) {
  const text = await fs.readFile(targetPath, 'utf8');
  if (maxLength && text.length > maxLength) {
    return `${text.slice(0, maxLength)}
...`;
  }
  return text;
}

export async function writeAtomic(targetPath: string, content: string) {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  const tempPath = `${targetPath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, content, 'utf8');
  await fs.rename(tempPath, targetPath);
}
