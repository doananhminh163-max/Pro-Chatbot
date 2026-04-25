import { Router } from 'express'
import { 
  upload, 
  uploadDocumentHandler, 
  listDocumentsHandler, 
  downloadDocumentHandler, 
  previewDocumentHandler,
  deleteDocumentHandler,
  deleteAllDocumentsHandler
} from '../controllers/document.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const documentRouter = Router()

documentRouter.use(requireAuth)

documentRouter.post('/upload', upload.single('file'), uploadDocumentHandler)
documentRouter.get('/', listDocumentsHandler)
documentRouter.delete('/', deleteAllDocumentsHandler)
documentRouter.get('/:id/download', downloadDocumentHandler)
documentRouter.get('/:id/preview', previewDocumentHandler)
documentRouter.delete('/:id', deleteDocumentHandler)

export default documentRouter
