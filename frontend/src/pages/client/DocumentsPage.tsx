import { useRef, useEffect, useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import PageSection from '../../components/PageSection'
import { fetchDocuments, uploadDocument, deleteDocument, deleteAllDocuments, downloadDocument, getPreviewUrl, type DocumentItem } from '../../services/documents'

function formatFileSize(sizeInBytes: number) {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`
  if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`
  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadDocs = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await fetchDocuments()
      setDocs(data)
    } catch (err) {
      setError('Failed to load documents.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadDocs()
  }, [])

  const filteredDocs = useMemo(() => {
    return docs.filter(d => d.originalName.toLowerCase().includes(search.toLowerCase()))
  }, [docs, search])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError('')
    try {
      await uploadDocument(file)
      await loadDocs()
    } catch (err) {
      setError('Failed to upload document.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return
    try {
      await deleteDocument(id)
      void loadDocs()
    } catch (err) {
      alert('Failed to delete document')
    }
  }

  const handleDeleteAllConfirm = async () => {
    try {
      await deleteAllDocuments()
      setIsDeleteAllOpen(false)
      void loadDocs()
    } catch (err) {
      setError('Failed to clear all documents.')
    }
  }

  const handleDownload = async (id: string, name: string) => {
    try {
      await downloadDocument(id, name)
    } catch (err) {
      alert('Failed to download document')
    }
  }

  const handlePreview = (id: string) => {
    const url = getPreviewUrl(id)
    window.open(url, '_blank')
  }

  return (
    <Stack spacing={3}>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />
      <PageSection
        title="Documents"
        subtitle="Search, sort, and manage your personal AI knowledge base"
        action={
          <Stack direction="row" spacing={1}>
            {docs.length > 0 && (
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteIcon />} 
                onClick={() => setIsDeleteAllOpen(true)}
              >
                Clear all
              </Button>
            )}
            <Button 
              variant="contained" 
              startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <UploadFileOutlinedIcon />} 
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </Stack>
        }
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
          <TextField 
            fullWidth 
            label="Search files" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Stack>
      </PageSection>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper variant="outlined" className="table-shell">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>File name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Session</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {filteredDocs.map((doc) => (
                    <TableRow key={doc.id} hover>
                      <TableCell>
                        <Typography variant="body2">{doc.originalName}</Typography>
                      </TableCell>
                      <TableCell>{doc.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}</TableCell>
                      <TableCell>{formatFileSize(doc.size)}</TableCell>
                      <TableCell>
                        {doc.sessionId && doc.session ? (
                          <Link
                            component={RouterLink}
                            to={`/chat?sessionId=${doc.sessionId}`}
                            sx={{ 
                              textDecoration: 'none', 
                              fontWeight: 500,
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            {doc.session.title}
                          </Link>
                        ) : (
                          <Typography variant="caption" color="text.secondary">Global</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                          <Tooltip title="Download">
                            <IconButton size="small" color="primary" onClick={() => handleDownload(doc.id, doc.originalName)}>
                              <DownloadForOfflineOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Preview">
                            <IconButton size="small" color="primary" onClick={() => handlePreview(doc.id)}>
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => handleDelete(doc.id)}>
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredDocs.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">No documents found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete All Confirmation Dialog */}
      <Dialog open={isDeleteAllOpen} onClose={() => setIsDeleteAllOpen(false)}>
        <DialogTitle>Clear All Documents?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete <strong>ALL</strong> documents in your knowledge base? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteAllOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAllConfirm} variant="contained" color="error">Clear All</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
