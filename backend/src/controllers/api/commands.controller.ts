import type { Request, Response } from 'express';
import {
  createCommand,
  deleteCommand,
  getCommand,
  listCommands,
  previewCommandTemplate,
} from 'services/opencode-control/commands.service.js';
import { noContent, ok, param } from './http.js';

export async function list(req: Request, res: Response) {
  ok(res, await listCommands(param(req, 'projectId')));
}

export async function create(req: Request, res: Response) {
  ok(res, await createCommand(param(req, 'projectId'), req.body), undefined, 201);
}

export async function previewTemplate(req: Request, res: Response) {
  ok(res, previewCommandTemplate(req.body));
}

export async function detail(req: Request, res: Response) {
  ok(res, await getCommand(param(req, 'projectId'), param(req, 'name')));
}

export async function remove(req: Request, res: Response) {
  await deleteCommand(param(req, 'projectId'), param(req, 'name'));
  noContent(res);
}
