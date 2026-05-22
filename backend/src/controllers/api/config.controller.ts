import type { Request, Response } from 'express';
import {
  applyConfigChange,
  backupWorkingTreeChanges,
  clearSnapshotReviewChanges,
  getConfigChange,
  listConfigBackups,
  listConfigChanges,
  previewConfigChange,
  readProjectConfig,
  reviewWorkingTreeChanges,
  rollbackConfig,
  searchProjectPaths,
  uploadInstructionFiles,
} from 'services/opencode-control/config.service.js';
import { ok, param } from './http.js';

export async function read(req: Request, res: Response) {
  ok(res, await readProjectConfig(param(req, 'projectId'), typeof req.query.scope === 'string' ? req.query.scope : 'project'));
}

export async function preview(req: Request, res: Response) {
  ok(res, await previewConfigChange(param(req, 'projectId'), req.body));
}

export async function uploadInstructions(req: Request, res: Response) {
  ok(res, await uploadInstructionFiles(param(req, 'projectId'), Array.isArray(req.files) ? req.files : []));
}

export async function paths(req: Request, res: Response) {
  ok(res, await searchProjectPaths(param(req, 'projectId'), {
    q: typeof req.query.q === 'string' ? req.query.q : undefined,
    limit: typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined,
  }));
}

export async function reviewChanges(req: Request, res: Response) {
  ok(res, await reviewWorkingTreeChanges(param(req, 'projectId')));
}

export async function backupChanges(req: Request, res: Response) {
  ok(res, await backupWorkingTreeChanges(param(req, 'projectId'), req.body));
}

export async function clearReviewChanges(req: Request, res: Response) {
  ok(res, await clearSnapshotReviewChanges(param(req, 'projectId'), req.body));
}

export async function applyChange(req: Request, res: Response) {
  ok(res, await applyConfigChange(param(req, 'configChangeId'), req.body));
}

export async function backups(req: Request, res: Response) {
  ok(res, await listConfigBackups(param(req, 'projectId')));
}

export async function rollback(req: Request, res: Response) {
  ok(res, await rollbackConfig(param(req, 'projectId'), req.body.backupId));
}

export async function change(req: Request, res: Response) {
  ok(res, await getConfigChange(param(req, 'configChangeId')));
}

export async function changes(req: Request, res: Response) {
  ok(res, await listConfigChanges(param(req, 'projectId')));
}
