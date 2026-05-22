import type { Request, Response } from 'express';
import { getPermissions, listTools, updatePermissions } from 'services/opencode-control/permissions.service.js';
import { ok, param } from './http.js';

export async function tools(req: Request, res: Response) {
  ok(res, await listTools(param(req, 'projectId')));
}

export async function read(req: Request, res: Response) {
  ok(res, await getPermissions(param(req, 'projectId')));
}

export async function update(req: Request, res: Response) {
  ok(res, await updatePermissions(param(req, 'projectId'), req.body), undefined, 202);
}
