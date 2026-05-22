import type { Request, Response } from 'express';
import { getWorkspaceAppState } from 'services/workspace.service.js';
import { ok } from './http.js';

export function health(_req: Request, res: Response) {
  res.json({
    success: true,
    data: {
      status: 'ok',
      version: '0.1.0',
      time: new Date().toISOString(),
    },
  });
}

export async function appState(_req: Request, res: Response) {
  ok(res, await getWorkspaceAppState());
}
