import type { Router } from 'express';
import * as mcpController from 'controllers/api/mcp.controller.js';
import { asyncHandler } from './shared.js';

export function registerMcpRoutes(router: Router) {
  router.get('/mcp-marketplace', asyncHandler(mcpController.marketplace));
  router.get('/projects/:projectId/mcp-servers', asyncHandler(mcpController.list));
  router.post('/projects/:projectId/mcp-servers/check', asyncHandler(mcpController.check));
  router.post('/projects/:projectId/mcp-servers/install', asyncHandler(mcpController.install));
  router.post('/projects/:projectId/mcp-servers', asyncHandler(mcpController.create));
  router.post('/projects/:projectId/mcp-servers/:name/test', asyncHandler(mcpController.test));
  router.patch('/projects/:projectId/mcp-servers/:name', asyncHandler(mcpController.update));
  router.delete('/projects/:projectId/mcp-servers/:name', asyncHandler(mcpController.remove));
}
