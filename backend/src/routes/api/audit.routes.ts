import type { Router } from 'express';
import * as auditController from 'controllers/api/audit.controller.js';
import { asyncHandler } from './shared.js';

export function registerAuditRoutes(router: Router) {
  router.get('/projects/:projectId/audit-logs', asyncHandler(auditController.list));
}
