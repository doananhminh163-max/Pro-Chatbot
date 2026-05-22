import type { Router } from 'express';
import multer from 'multer';
import * as configController from 'controllers/api/config.controller.js';
import { asyncHandler } from './shared.js';

const instructionUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 20,
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter: (_req, file, callback) => {
    callback(null, /\.(md|txt)$/i.test(file.originalname));
  },
});

export function registerConfigRoutes(router: Router) {
  router.get('/projects/:projectId/config', asyncHandler(configController.read));
  router.get('/projects/:projectId/config/paths', asyncHandler(configController.paths));
  router.post('/projects/:projectId/config/preview', asyncHandler(configController.preview));
  router.post(
    '/projects/:projectId/config/instructions/upload-files',
    instructionUpload.array('files', 20),
    asyncHandler(configController.uploadInstructions),
  );
  router.get('/projects/:projectId/changes/review', asyncHandler(configController.reviewChanges));
  router.post('/projects/:projectId/changes/review/clear', asyncHandler(configController.clearReviewChanges));
  router.post('/projects/:projectId/changes/backup', asyncHandler(configController.backupChanges));
  router.post('/config-changes/:configChangeId/apply', asyncHandler(configController.applyChange));
  router.get('/projects/:projectId/config/backups', asyncHandler(configController.backups));
  router.post('/projects/:projectId/config/rollback', asyncHandler(configController.rollback));
  router.get('/config-changes/:configChangeId', asyncHandler(configController.change));
  router.get('/projects/:projectId/config-changes', asyncHandler(configController.changes));
}
