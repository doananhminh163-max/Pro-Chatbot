import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PageSection from '../../components/PageSection'
import { fetchChatSessions, updateSession, deleteSession, deleteAllSessions, type ChatSessionSummary } from '../../services/chat'

export default function SessionsPage() {
  const [keyword, setKeyword] = useState('')
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedSession, setSelectedSession] = useState<ChatSessionSummary | null>(null)

  // Rename dialog state
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  // Delete dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false)

  const loadSessions = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await fetchChatSessions()
      setSessions(data)
    } catch (err) {
      setError('Unable to load chat sessions history.')
      console.error('[SessionsPage] fetch failed', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadSessions()
  }, [])

  const filteredSessions = useMemo(() => {
    const query = keyword.trim().toLowerCase()

    if (!query) return sessions

    return sessions.filter((item) => item.title.toLowerCase().includes(query))
  }, [keyword, sessions])

  const handleSessionClick = (id: string) => {
    navigate(`/chat?sessionId=${id}`)
  }

  const handleMenuOpen = (event: MouseEvent<HTMLElement>, session: ChatSessionSummary) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedSession(session)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleRenameClick = () => {
    if (selectedSession) {
      setNewTitle(selectedSession.title)
      setIsRenameOpen(true)
    }
    handleMenuClose()
  }

  const handleDeleteClick = () => {
    setIsDeleteOpen(true)
    handleMenuClose()
  }

  const handleRenameConfirm = async () => {
    if (!selectedSession || !newTitle.trim()) return

    try {
      await updateSession(selectedSession.id, newTitle)
      setIsRenameOpen(false)
      void loadSessions()
    } catch (err) {
      setError('Failed to rename session.')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedSession) return

    try {
      await deleteSession(selectedSession.id)
      setIsDeleteOpen(false)
      setSelectedSession(null)
      void loadSessions()
    } catch (err) {
      setError('Failed to delete session.')
    }
  }

  const handleDeleteAllConfirm = async () => {
    try {
      await deleteAllSessions()
      setIsDeleteAllOpen(false)
      void loadSessions()
    } catch (err) {
      setError('Failed to clear all sessions.')
    }
  }

  return (
    <Stack spacing={3}>
      <PageSection 
        title="Sessions History" 
        subtitle="Find and continue any conversation quickly"
        action={
          sessions.length > 0 ? (
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<DeleteIcon />} 
              onClick={() => setIsDeleteAllOpen(true)}
            >
              Clear all
            </Button>
          ) : undefined
        }
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
          <TextField
            fullWidth
            label="Search session"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </Stack>
      </PageSection>

      {error ? <Alert severity="error" onClose={() => setError('')}>{error}</Alert> : null}

      <Paper variant="outlined" className="session-history-shell">
        <List disablePadding>
          {isLoading ? (
            <Stack sx={{ py: 8, alignItems: 'center' }}>
              <CircularProgress size={32} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Loading history...
              </Typography>
            </Stack>
          ) : (
            <>
              {filteredSessions.map((session) => (
                <ListItemButton 
                  key={session.id} 
                  className="session-history-item"
                  onClick={() => handleSessionClick(session.id)}
                  sx={{ pr: 8 }}
                >
                  <ListItemText 
                    primary={session.title} 
                    secondary={session.lastMessage ? `Last: ${session.lastMessage.content.slice(0, 100)}${session.lastMessage.content.length > 100 ? '...' : ''}` : 'No messages'}
                  />
                  <Stack direction="row" spacing={1} sx={{ position: 'absolute', right: 16, alignItems: 'center' }}>
                    <Chip label={`${session.messageCount} msgs`} size="small" variant="outlined" />
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, session)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </ListItemButton>
              ))}
              
              {filteredSessions.length === 0 ? (
                <Stack spacing={0.5} sx={{ py: 8, alignItems: 'center' }}>
                  <Typography variant="h6">No sessions found</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {keyword.trim() ? 'Try another keyword.' : 'You haven\'t started any conversation yet.'}
                  </Typography>
                </Stack>
              ) : null}
            </>
          )}
        </List>
      </Paper>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleRenameClick}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onClose={() => setIsRenameOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Rename Session</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Title"
            fullWidth
            variant="outlined"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRenameOpen(false)}>Cancel</Button>
          <Button onClick={handleRenameConfirm} variant="contained" disabled={!newTitle.trim()}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <DialogTitle>Delete Session?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete "<strong>{selectedSession?.title}</strong>"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Delete All Confirmation Dialog */}
      <Dialog open={isDeleteAllOpen} onClose={() => setIsDeleteAllOpen(false)}>
        <DialogTitle>Clear All Sessions?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete <strong>ALL</strong> chat sessions and their associated documents? This action cannot be undone.
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
