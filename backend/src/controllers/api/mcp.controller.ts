import type { Request, Response } from 'express';
import {
  checkMcpServers,
  createMcpServer,
  deleteMcpServer,
  installMcpMarketplaceServer,
  listMcpMarketplace,
  listMcpServers,
  testMcpServer,
  updateMcpServer,
} from 'services/opencode-control/mcp.service.js';
import { ok, param } from './http.js';

export async function list(req: Request, res: Response) {
  ok(res, await listMcpServers(param(req, 'projectId')));
}

export async function marketplace(req: Request, res: Response) {
  ok(res, await listMcpMarketplace({
    q: typeof req.query.q === 'string' ? req.query.q : undefined,
    limit: Number(req.query.limit),
  }));
}

export async function create(req: Request, res: Response) {
  ok(res, await createMcpServer(param(req, 'projectId'), req.body), undefined, 202);
}

export async function install(req: Request, res: Response) {
  ok(res, await installMcpMarketplaceServer(param(req, 'projectId'), req.body), undefined, 201);
}

export async function check(req: Request, res: Response) {
  ok(res, await checkMcpServers(param(req, 'projectId')));
}

export async function test(req: Request, res: Response) {
  ok(res, await testMcpServer(param(req, 'projectId'), param(req, 'name')));
}

export async function update(req: Request, res: Response) {
  ok(res, await updateMcpServer(param(req, 'projectId'), param(req, 'name'), req.body), undefined, 202);
}

export async function remove(req: Request, res: Response) {
  ok(res, await deleteMcpServer(param(req, 'projectId'), param(req, 'name')), undefined, 202);
}
