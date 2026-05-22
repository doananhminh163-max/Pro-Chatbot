import type { Request, Response } from 'express';
import {
  createAgent,
  deleteAgent,
  getAgent,
  listAgents,
  setDefaultAgent,
  updateAgent,
} from 'services/opencode-control/agents.service.js';
import { noContent, ok, param } from './http.js';

export async function list(req: Request, res: Response) {
  ok(res, await listAgents(param(req, 'projectId')));
}

export async function create(req: Request, res: Response) {
  ok(res, await createAgent(param(req, 'projectId'), req.body), undefined, 202);
}

export async function detail(req: Request, res: Response) {
  ok(res, await getAgent(param(req, 'projectId'), param(req, 'agentName')));
}

export async function update(req: Request, res: Response) {
  ok(res, await updateAgent(param(req, 'projectId'), param(req, 'agentName'), req.body), undefined, 202);
}

export async function remove(req: Request, res: Response) {
  await deleteAgent(param(req, 'projectId'), param(req, 'agentName'));
  noContent(res);
}

export async function setDefault(req: Request, res: Response) {
  ok(res, await setDefaultAgent(param(req, 'projectId'), req.body.agentName), undefined, 202);
}
