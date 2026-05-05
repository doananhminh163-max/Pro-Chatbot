import type { ChangeEvent, KeyboardEventHandler } from 'react'
import { Box, Button, Chip, Paper, Stack, TextField, Typography } from '@mui/material'
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'

type ComposeStatus = 'ready' | 'thinking' | 'streaming' | 'error'

interface ChatComposerProps {
  attachments: File[]
  composerRef: React.RefObject<HTMLTextAreaElement | null>
  composeStatus: ComposeStatus
  isPromptTooLong: boolean
  isSending: boolean
  isUserMessageLimitReached: boolean
  maxPromptCharacters: number
  maxUserMessagesPerSession: number
  messageInput: string
  onAttachmentPick: () => void
  onChangeMessage: (value: string) => void
  onKeyDown: KeyboardEventHandler<HTMLDivElement>
  onRemoveAttachment: (index: number) => void
  onRetryDraft: () => void
  onSendMessage: () => void
  promptLength: number
  userMessageCount: number
}

export default function ChatComposer({
  attachments,
  composerRef,
  composeStatus,
  isPromptTooLong,
  isSending,
  isUserMessageLimitReached,
  maxPromptCharacters,
  maxUserMessagesPerSession,
  messageInput,
  onAttachmentPick,
  onChangeMessage,
  onKeyDown,
  onRemoveAttachment,
  onRetryDraft,
  onSendMessage,
  promptLength,
  userMessageCount,
}: ChatComposerProps) {
  return (
    <Paper variant="outlined" className="chat-composer">
      {attachments.length > 0 ? (
        <Box
          sx={{
            p: 1,
            borderBottom: '1px solid var(--border-soft)',
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {attachments.map((file, index) => (
            <Chip
              key={`composer-file-${file.name}-${index}`}
              label={file.name}
              onDelete={() => onRemoveAttachment(index)}
              size="small"
              variant="outlined"
              icon={<InsertDriveFileOutlinedIcon sx={{ fontSize: '16px !important' }} />}
              sx={{ maxWidth: 200 }}
            />
          ))}
        </Box>
      ) : null}

      <TextField
        multiline
        minRows={3}
        maxRows={8}
        placeholder="Ask your question or attach a file..."
        value={messageInput}
        onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChangeMessage(event.target.value)}
        onKeyDown={onKeyDown}
        fullWidth
        inputRef={composerRef}
        autoFocus
        error={isPromptTooLong}
        helperText={
          isPromptTooLong
            ? `Prompt text is limited to ${maxPromptCharacters} characters. Upload a file for longer content.`
            : `${promptLength}/${maxPromptCharacters} characters`
        }
      />

      <Stack className="chat-composer__footer" direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip
            label={`User turns ${userMessageCount}/${maxUserMessagesPerSession}`}
            color={isUserMessageLimitReached ? 'error' : 'default'}
            size="small"
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary">
            Ctrl + Enter to send
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            type="button"
            variant="outlined"
            startIcon={<AttachFileRoundedIcon />}
            onClick={onAttachmentPick}
            disabled={isSending}
          >
            Attach file
          </Button>

          {composeStatus === 'error' ? (
            <Button
              type="button"
              variant="outlined"
              color="error"
              startIcon={<RefreshRoundedIcon />}
              onClick={onRetryDraft}
            >
              Retry
            </Button>
          ) : null}

          <Button
            variant="contained"
            endIcon={<SendRoundedIcon />}
            onClick={onSendMessage}
            disabled={
              isSending
              || (!messageInput.trim() && attachments.length === 0)
              || isPromptTooLong
              || isUserMessageLimitReached
            }
          >
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
