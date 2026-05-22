import type { Router } from 'express';
import * as commandsController from 'controllers/api/commands.controller.js';
import { asyncHandler } from './shared.js';

export function registerCommandRoutes(router: Router) {
  router.get('/projects/:projectId/commands', asyncHandler(commandsController.list));
  router.post('/projects/:projectId/commands', asyncHandler(commandsController.create));
  router.post('/projects/:projectId/commands/preview-template', asyncHandler(commandsController.previewTemplate));
  router.get('/projects/:projectId/commands/:name', asyncHandler(commandsController.detail));
  router.delete('/projects/:projectId/commands/:name', asyncHandler(commandsController.remove));
}
