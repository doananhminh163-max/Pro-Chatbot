import type { Router } from 'express';
import * as skillsController from 'controllers/api/skills.controller.js';
import { asyncHandler } from './shared.js';

export function registerSkillRoutes(router: Router) {
  router.get('/projects/:projectId/skills', asyncHandler(skillsController.list));
  router.post('/skills/find', asyncHandler(skillsController.externalFind));
  router.post('/skills/install-global', asyncHandler(skillsController.installGlobal));
  router.get('/projects/:projectId/skills/:skillName', asyncHandler(skillsController.detail));
  router.post('/projects/:projectId/skills/validate', asyncHandler(skillsController.validate));
  router.post('/projects/:projectId/skills/import', asyncHandler(skillsController.importProjectSkill));
  router.patch('/projects/:projectId/skills/:skillName', asyncHandler(skillsController.updateStatus));
  router.delete('/projects/:projectId/skills/:skillName', asyncHandler(skillsController.remove));
  router.get('/skills/marketplace', asyncHandler(skillsController.marketplace));
  router.get('/skills/marketplace/:marketplaceSkillId/preview', asyncHandler(skillsController.marketplacePreview));
  router.post('/projects/:projectId/skills/install', asyncHandler(skillsController.install));
  router.post('/skills/marketplace/refresh', asyncHandler(skillsController.refresh));
}
