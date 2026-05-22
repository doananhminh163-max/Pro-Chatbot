import type { Router } from 'express';
import * as chatController from 'controllers/api/chat.controller.js';
import { asyncHandler } from './shared.js';

export function registerChatRoutes(router: Router) {
  router.post('/chat/config-intents', asyncHandler(chatController.configIntent));
  router.get('/projects/:projectId/chat/files', asyncHandler(chatController.files));
  router.get('/projects/:projectId/chat/sessions', asyncHandler(chatController.listSessions));
  router.post('/projects/:projectId/chat/sessions', asyncHandler(chatController.createSession));
  router.get('/projects/:projectId/chat/sessions/:sessionId', asyncHandler(chatController.sessionDetail));
  router.patch('/projects/:projectId/chat/sessions/:sessionId', asyncHandler(chatController.updateSession));
  router.delete('/projects/:projectId/chat/sessions/:sessionId', asyncHandler(chatController.deleteSession));
  router.get('/projects/:projectId/chat/sessions/:sessionId/export', asyncHandler(chatController.exportSession));
  router.patch('/projects/:projectId/chat/sessions/:sessionId/context', asyncHandler(chatController.updateSessionContext));
  router.post('/projects/:projectId/chat/sessions/:sessionId/permissions/:permissionId', asyncHandler(chatController.respondPermission));
  router.post('/projects/:projectId/chat/sessions/:sessionId/messages/stream', asyncHandler(chatController.streamMessage));
  router.post('/projects/:projectId/chat/sessions/:sessionId/messages', asyncHandler(chatController.sendMessage));
}
