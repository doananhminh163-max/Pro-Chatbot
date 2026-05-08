import { Router } from 'express'
import {
  createAdminAgentHandler,
  deleteAdminAgentHandler,
  getAdminAgentsHandler,
  getAdminConfigHandler,
  getAdminLogsHandler,
  getAdminOverviewHandler,
  getAdminProvidersHandler,
  getAdminUsersHandler,
  updateAdminAgentHandler,
} from '../controllers/admin.controller.js'
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js'

const adminRouter = Router()

adminRouter.use(requireAuth)
adminRouter.use(requireAdmin)

adminRouter.get('/overview', getAdminOverviewHandler)
adminRouter.get('/users', getAdminUsersHandler)
adminRouter.get('/providers', getAdminProvidersHandler)
adminRouter.get('/agents', getAdminAgentsHandler)
adminRouter.post('/agents', createAdminAgentHandler)
adminRouter.patch('/agents/:agentId', updateAdminAgentHandler)
adminRouter.delete('/agents/:agentId', deleteAdminAgentHandler)
adminRouter.get('/config', getAdminConfigHandler)
adminRouter.get('/logs', getAdminLogsHandler)

export default adminRouter
