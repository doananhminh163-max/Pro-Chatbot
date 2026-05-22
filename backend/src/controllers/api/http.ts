import type { Request, Response } from 'express';

export function ok(res: Response, data: unknown, meta?: unknown, status = 200) {
  res.status(status).json({ success: true, data, ...(meta ? { meta } : {}) });
}

export function noContent(res: Response) {
  res.status(204).send();
}

export function param(req: Request, name: string) {
  const value = req.params[name];
  return Array.isArray(value) ? value[0] : value;
}
