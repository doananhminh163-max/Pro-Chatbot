import type { Request, Response } from 'express';
import { listAuditLogs } from 'services/opencode-control/audit.service.js';
import { ok, param } from './http.js';

export async function list(req: Request, res: Response) {
  const result = await listAuditLogs(param(req, 'projectId'), {
    targetType: typeof req.query.targetType === 'string' ? req.query.targetType : undefined,
    targetId: typeof req.query.targetId === 'string' ? req.query.targetId : undefined,
    page: Number(req.query.page),
    pageSize: Number(req.query.pageSize),
  });
  ok(res, result.data, result.meta);
}
