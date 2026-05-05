import { Alert, Box, Divider, FormControlLabel, IconButton, Paper, Stack, Switch, Typography } from '@mui/material'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import ConfigField from '../../../components/ConfigField'
import type { DocumentItem } from '../../../services/documents'
import type { ChatProvider, SendMessageMeta } from '../../../services/chat'
import ChatFileThumbnail from './ChatFileThumbnail'

interface Option {
  value: string
  label: string
}

interface ChatConfigPanelProps {
  activeAgentOptions: Option[]
  activeModelOptions: Option[]
  activeProviderOptions: Array<{ value: ChatProvider; label: string }>
  agent: string
  attachments: File[]
  executionMeta: SendMessageMeta | null
  memoryEnabled: boolean
  model: string
  onChangeAgent: (value: string) => void
  onChangeMemory: (value: boolean) => void
  onChangeModel: (value: string) => void
  onChangeProvider: (value: ChatProvider) => void
  onRemoveAttachment: (index: number) => void
  provider: ChatProvider
  sessionDocuments: DocumentItem[]
}

export default function ChatConfigPanel({
  activeAgentOptions,
  activeModelOptions,
  activeProviderOptions,
  agent,
  attachments,
  executionMeta,
  memoryEnabled,
  model,
  onChangeAgent,
  onChangeMemory,
  onChangeModel,
  onChangeProvider,
  onRemoveAttachment,
  provider,
  sessionDocuments,
}: ChatConfigPanelProps) {
  return (
    <Paper className="chat-panel chat-panel-config" elevation={0}>
      <Stack spacing={1.5}>
        <Typography variant="h6">Config Panel</Typography>

        <ConfigField
          label="Agent"
          value={agent}
          onChange={onChangeAgent}
          options={activeAgentOptions}
        />

        <ConfigField
          label="Provider"
          value={provider}
          onChange={(value) => onChangeProvider(value as ChatProvider)}
          options={activeProviderOptions}
        />

        <ConfigField
          label="Model"
          value={model}
          onChange={onChangeModel}
          options={activeModelOptions}
        />

        <Paper variant="outlined" sx={{ p: 1.5, borderColor: 'var(--border-soft)' }}>
          <Stack spacing={0.5}>
            <FormControlLabel
              control={
                <Switch
                  checked={memoryEnabled}
                  onChange={(event) => onChangeMemory(event.target.checked)}
                />
              }
              label="Memory"
              sx={{ m: 0, justifyContent: 'space-between' }}
            />
            <Typography variant="caption" color="text.secondary">
              Allow the chatbot to learn from your conversations to better understand you.
            </Typography>
          </Stack>
        </Paper>

        <Divider sx={{ my: 1 }} />

        <Stack spacing={1}>
          <Typography variant="subtitle2">Attachments</Typography>

          {sessionDocuments.length === 0 && attachments.length === 0 ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 1 }}>
              No files attached
            </Typography>
          ) : (
            <Stack spacing={0.75}>
              {sessionDocuments.map((doc) => (
                <Box key={doc.id} sx={{ opacity: 0.9 }}>
                  <ChatFileThumbnail doc={doc} canDownload />
                </Box>
              ))}

              {attachments.map((file, index) => (
                <ChatFileThumbnail
                  key={`local-${file.name}-${index}`}
                  doc={{ originalName: file.name, size: file.size }}
                  isPending
                  removeButton={
                    <IconButton size="small" color="error" onClick={() => onRemoveAttachment(index)}>
                      <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  }
                />
              ))}
            </Stack>
          )}
        </Stack>

        {executionMeta ? (
          <Alert severity={executionMeta.fallbackUsed ? 'warning' : 'success'}>
            Requested {executionMeta.requestedProvider.toUpperCase()} / {executionMeta.requestedModel ?? 'default'}.
            {executionMeta.usedProvider
              ? ` Executed by ${executionMeta.usedProvider.toUpperCase()}${executionMeta.fallbackUsed ? ' (fallback).' : '.'}`
              : ' Waiting for execution metadata.'}
          </Alert>
        ) : null}
      </Stack>
    </Paper>
  )
}
