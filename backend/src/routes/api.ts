import express, { Express, NextFunction, Request, Response } from 'express';
import { ApiError } from 'services/opencode-control/errors.js';
import { registerAgentRoutes } from './api/agents.routes.js';
import { registerAuditRoutes } from './api/audit.routes.js';
import { registerChatRoutes } from './api/chat.routes.js';
import { registerCommandRoutes } from './api/commands.routes.js';
import { registerConfigRoutes } from './api/config.routes.js';
import { registerMcpRoutes } from './api/mcp.routes.js';
import { registerPermissionRoutes } from './api/permissions.routes.js';
import { registerProjectRoutes } from './api/projects.routes.js';
import { registerSkillRoutes } from './api/skills.routes.js';
import { registerSystemRoutes } from './api/system.routes.js';

const routeRegistrars = [
  registerSystemRoutes,
  registerProjectRoutes,
  registerConfigRoutes,
  registerAgentRoutes,
  registerPermissionRoutes,
  registerSkillRoutes,
  registerMcpRoutes,
  registerCommandRoutes,
  registerChatRoutes,
  registerAuditRoutes,
];

const activateApiRoutes = (app: Express) => {
  const router = express.Router();

  for (const registerRoutes of routeRegistrars) {
    registerRoutes(router);
  }

  app.use('/api', router);

  app.use('/api', (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const apiError = error instanceof ApiError
      ? error
      : new ApiError(500, 'INTERNAL_SERVER_ERROR', error instanceof Error ? error.message : 'Unexpected server error');
    res.status(apiError.status).json({
      success: false,
      error: {
        code: apiError.code,
        message: apiError.message,
        details: apiError.details,
      },
      meta: {
        requestId: `req_${Date.now()}`,
      },
    });
  });
};

export default activateApiRoutes;
