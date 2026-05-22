import type { Request, Response } from 'express';
import {
  createChatSession,
  deleteChatSession,
  exportChatSession,
  getChatSession,
  listChatSessions,
  parseConfigIntent,
  respondChatPermission,
  searchChatFiles,
  searchChatReferences,
  sendChatMessage,
  streamChatMessage,
  updateChatSession,
  updateChatSessionContext,
} from 'services/opencode-control/chat.service.js';
import { ok, param } from './http.js';

export async function configIntent(req: Request, res: Response) {
  ok(res, await parseConfigIntent(req.body), undefined, 202);
}

export async function listSessions(req: Request, res: Response) {
  ok(res, await listChatSessions(param(req, 'projectId'), {
    status: typeof req.query.status === 'string' ? req.query.status : undefined,
  }));
}

export async function files(req: Request, res: Response) {
  ok(res, await searchChatFiles(param(req, 'projectId'), {
    q: typeof req.query.q === 'string' ? req.query.q : undefined,
    limit: typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined,
  }));
}

export async function references(req: Request, res: Response) {
  ok(res, await searchChatReferences(param(req, 'projectId'), {
    q: typeof req.query.q === 'string' ? req.query.q : undefined,
    limit: typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined,
  }));
}

export async function createSession(req: Request, res: Response) {
  ok(res, await createChatSession(param(req, 'projectId'), req.body), undefined, 201);
}

export async function sessionDetail(req: Request, res: Response) {
  ok(res, await getChatSession(param(req, 'projectId'), param(req, 'sessionId')));
}

export async function updateSession(req: Request, res: Response) {
  ok(res, await updateChatSession(param(req, 'projectId'), param(req, 'sessionId'), req.body));
}

export async function deleteSession(req: Request, res: Response) {
  ok(res, await deleteChatSession(param(req, 'projectId'), param(req, 'sessionId')));
}

export async function exportSession(req: Request, res: Response) {
  ok(res, await exportChatSession(param(req, 'projectId'), param(req, 'sessionId')));
}

export async function updateSessionContext(req: Request, res: Response) {
  ok(res, await updateChatSessionContext(param(req, 'projectId'), param(req, 'sessionId'), req.body));
}

export async function sendMessage(req: Request, res: Response) {
  ok(res, await sendChatMessage(param(req, 'projectId'), param(req, 'sessionId'), req.body));
}

export async function respondPermission(req: Request, res: Response) {
  ok(res, await respondChatPermission(param(req, 'projectId'), param(req, 'sessionId'), param(req, 'permissionId'), req.body));
}

function writeStreamEvent(res: Response, payload: unknown) {
  if (res.writableEnded || res.destroyed) return;
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

export async function streamMessage(req: Request, res: Response) {
  const abortController = new AbortController();
  res.on('close', () => abortController.abort());

  res.status(200);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  try {
    for await (const event of streamChatMessage(param(req, 'projectId'), param(req, 'sessionId'), {
      ...req.body,
      signal: abortController.signal,
    })) {
      writeStreamEvent(res, event);
    }
  } catch (error) {
    if (abortController.signal.aborted || res.destroyed) {
      return;
    }
    writeStreamEvent(res, {
      type: 'error',
      error: {
        message: error instanceof Error ? error.message : 'OpenCode chat stream failed',
      },
    });
  } finally {
    if (!res.writableEnded && !res.destroyed) {
      res.end();
    }
  }
}
