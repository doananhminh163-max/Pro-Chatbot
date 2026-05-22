import type { Router } from 'express';
import * as permissionsController from 'controllers/api/permissions.controller.js';
import { asyncHandler } from './shared.js';

export function registerPermissionRoutes(router: Router) {
  router.get('/projects/:projectId/tools', asyncHandler(permissionsController.tools));
  router.get('/projects/:projectId/permissions', asyncHandler(permissionsController.read));
  router.patch('/projects/:projectId/permissions', asyncHandler(permissionsController.update));
}
