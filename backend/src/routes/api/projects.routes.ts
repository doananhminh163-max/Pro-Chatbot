import type { Router } from 'express';
import * as projectsController from 'controllers/api/projects.controller.js';
import { asyncHandler } from './shared.js';

export function registerProjectRoutes(router: Router) {
  router.get('/projects', asyncHandler(projectsController.list));
  router.post('/projects', asyncHandler(projectsController.create));
  router.get('/projects/:projectId/status', asyncHandler(projectsController.status));
  router.delete('/projects/:projectId', asyncHandler(projectsController.remove));
  router.get('/projects/:projectId/server-connections', asyncHandler(projectsController.serverConnections));
  router.post('/projects/:projectId/server-connections', asyncHandler(projectsController.createServer));
  router.post('/projects/:projectId/server-connections/:connectionId/test', asyncHandler(projectsController.testServer));
}
