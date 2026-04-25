import { Router } from 'express'
import {
  getConfigHandler,
  getSessionMessagesHandler,
  listSessionsHandler,
  sendMessageHandler,
  updateSessionHandler,
  deleteSessionHandler,
  deleteAllSessionsHandler,
} from '../controllers/chat.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const chatRouter = Router()

chatRouter.use(requireAuth)
chatRouter.get('/config', getConfigHandler)
chatRouter.get('/sessions', listSessionsHandler)
chatRouter.delete('/sessions', deleteAllSessionsHandler)
chatRouter.get('/sessions/:sessionId/messages', getSessionMessagesHandler)
chatRouter.patch('/sessions/:sessionId', updateSessionHandler)
chatRouter.delete('/sessions/:sessionId', deleteSessionHandler)
chatRouter.post('/messages', sendMessageHandler)

export default chatRouter
