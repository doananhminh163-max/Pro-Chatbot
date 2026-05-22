import type { Request, Response } from 'express';
import {
  createProject,
  createServerConnection,
  deleteProject,
  getProjectStatus,
  listProjects,
  listServerConnections,
  testServerConnection,
} from 'services/opencode-control/projects.service.js';
import { noContent, ok, param } from './http.js';

export async function list(req: Request, res: Response) {
  const result = await listProjects({
    q: typeof req.query.q === 'string' ? req.query.q : undefined,
    page: Number(req.query.page),
    pageSize: Number(req.query.pageSize),
  });
  ok(res, result.data, result.meta);
}

export async function create(req: Request, res: Response) {
  ok(res, await createProject(req.body), undefined, 201);
}

export async function status(req: Request, res: Response) {
  ok(res, await getProjectStatus(param(req, 'projectId')));
}

export async function remove(req: Request, res: Response) {
  await deleteProject(param(req, 'projectId'));
  noContent(res);
}

export async function serverConnections(req: Request, res: Response) {
  ok(res, await listServerConnections(param(req, 'projectId')));
}

export async function createServer(req: Request, res: Response) {
  ok(res, await createServerConnection(param(req, 'projectId'), req.body), undefined, 201);
}

export async function testServer(req: Request, res: Response) {
  ok(res, await testServerConnection(param(req, 'projectId'), param(req, 'connectionId')));
}
