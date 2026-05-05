import type { ReactNode } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import { downloadDocument, type DocumentItem } from '../../../services/documents'

interface PendingAttachment {
  originalName: string
  size: number
}

interface ChatFileThumbnailProps {
  doc: DocumentItem | PendingAttachment
  canDownload?: boolean
  isPending?: boolean
  removeButton?: ReactNode
}

function formatFileSize(sizeInBytes: number) {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ChatFileThumbnail({
  doc,
  canDownload = false,
  isPending = false,
  removeButton,
}: ChatFileThumbnailProps) {
  const isStoredDocument = 'id' in doc

  return (
    <Box
      className={`chat-file-thumbnail${isPending ? ' is-pending' : ''}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 0.75,
        borderRadius: 1,
        border: '1px solid var(--border-soft)',
        bgcolor: 'background.paper',
        maxWidth: 240,
      }}
    >
      <InsertDriveFileOutlinedIcon sx={{ fontSize: 20, color: isPending ? 'warning.main' : 'primary.main' }} />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" noWrap sx={{ display: 'block', fontWeight: 600 }}>
          {doc.originalName}
          {isPending ? ' (Ready)' : ''}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatFileSize(doc.size)}
        </Typography>
      </Box>
      {canDownload && isStoredDocument ? (
        <IconButton
          size="small"
          onClick={() => void downloadDocument(doc.id, doc.originalName)}
          aria-label={`Download ${doc.originalName}`}
        >
          <DownloadRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      ) : null}
      {removeButton}
    </Box>
  )
}
