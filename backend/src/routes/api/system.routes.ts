import type { Router } from 'express';
import * as systemController from 'controllers/api/system.controller.js';
import { asyncHandler } from './shared.js';

export function registerSystemRoutes(router: Router) {
  router.get('/health', systemController.health);
  router.get('/app-state', asyncHandler(systemController.appState));
}
