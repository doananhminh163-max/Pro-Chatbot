import type { Router } from 'express';
import * as agentsController from 'controllers/api/agents.controller.js';
import { asyncHandler } from './shared.js';

export function registerAgentRoutes(router: Router) {
  router.get('/projects/:projectId/agents', asyncHandler(agentsController.list));
  router.post('/projects/:projectId/agents', asyncHandler(agentsController.create));
  router.get('/projects/:projectId/agents/:agentName', asyncHandler(agentsController.detail));
  router.patch('/projects/:projectId/agents/:agentName', asyncHandler(agentsController.update));
  router.delete('/projects/:projectId/agents/:agentName', asyncHandler(agentsController.remove));
  router.post('/projects/:projectId/agents/default', asyncHandler(agentsController.setDefault));
}
