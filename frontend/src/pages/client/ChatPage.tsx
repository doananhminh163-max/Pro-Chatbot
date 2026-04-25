import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEventHandler,
  type ReactNode,
} from 'react'
import { isAxiosError } from 'axios'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton,
} from '@mui/material'
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import { useSearchParams } from 'react-router-dom'
import ConfigField from '../../components/ConfigField'
import {
  fetchChatSession,
  fetchChatSessions,
  fetchChatConfig,
  sendChatMessage,
  type ChatConfig,
  type ChatMessage,
  type ChatProvider,
  type SendMessageMeta,
} from '../../services/chat'
import { uploadDocument, downloadDocument, type DocumentItem } from '../../services/documents'

const PROVIDER_OPTIONS: Array<{ value: ChatProvider; label: string }> = [
  { value: 'gemini', label: 'Gemini CLI' },
]

const GEMINI_MODEL_OPTIONS = [
  { value: 'gemini-3.1-pro-preview', label: 'gemini-3.1-pro-preview' },
  { value: 'gemini-3-flash-preview', label: 'gemini-3-flash-preview' },
  { value: 'gemini-3.1-flash-lite-preview', label: 'gemini-3.1-flash-lite-preview' },
  { value: 'gemini-2.5-pro', label: 'gemini-2.5-pro' },
  { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
  { value: 'gemini-2.5-flash-lite', label: 'gemini-2.5-flash-lite' },
]

type MemoryMode = 'session' | 'global' | 'hybrid'
type ComposeStatus = 'ready' | 'thinking' | 'streaming' | 'error'

interface MarkdownSegment {
  type: 'text' | 'code'
  content: string
  language?: string
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

function resolveRequestErrorMessage(requestError: unknown, fallback: string) {
  if (isAxiosError<{ message?: string }>(requestError)) {
    return requestError.response?.data?.message ?? requestError.message ?? fallback
  }

  if (requestError instanceof Error && requestError.message) {
    return requestError.message
  }

  return fallback
}

function parseMarkdownSegments(content: string): MarkdownSegment[] {
  const segments: MarkdownSegment[] = []
  const codeBlockPattern = /```([\w-]+)?\n?([\s\S]*?)```/g
  let lastIndex = 0

  for (const match of content.matchAll(codeBlockPattern)) {
    const index = match.index ?? 0

    if (index > lastIndex) {
      segments.push({
        type: 'text',
        content: content.slice(lastIndex, index).trim(),
      })
    }

    segments.push({
      type: 'code',
      language: match[1] || 'text',
      content: (match[2] || '').trimEnd(),
    })

    lastIndex = index + match[0].length
  }

  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      content: content.slice(lastIndex).trim(),
    })
  }

  if (segments.length === 0) {
    segments.push({ type: 'text', content })
  }

  return segments.filter((segment) => segment.content.length > 0 || segment.type === 'code')
}

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^\)]+\))/g
  let lastIndex = 0
  let tokenIndex = 0

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0

    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index))
    }

    const token = match[0]

    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={`${keyPrefix}-strong-${tokenIndex}`}>
          {token.slice(2, -2)}
        </strong>,
      )
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={`${keyPrefix}-code-${tokenIndex}`} className="message-markdown__inline-code">
          {token.slice(1, -1)}
        </code>,
      )
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^\)]+)\)$/)

      if (linkMatch) {
        parts.push(
          <a
            key={`${keyPrefix}-link-${tokenIndex}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer"
          >
            {linkMatch[1]}
          </a>,
        )
      } else {
        parts.push(token)
      }
    }

    lastIndex = index + token.length
    tokenIndex += 1
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

function renderTextMarkdown(content: string, keyPrefix: string): ReactNode[] {
  const blocks = content.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean)

  return blocks.map((block, index) => {
    const lines = block.split('\n')

    if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
      return (
        <ul key={`${keyPrefix}-ul-${index}`} className="message-markdown__list">
          {lines.map((line, lineIndex) => (
            <li key={`${keyPrefix}-ul-item-${lineIndex}`}>
              {renderInlineMarkdown(line.replace(/^\s*[-*]\s+/, ''), `${keyPrefix}-ul-${index}-${lineIndex}`)}
            </li>
          ))}
        </ul>
      )
    }

    if (lines.every((line) => /^\s*\d+\.\s+/.test(line))) {
      return (
        <ol key={`${keyPrefix}-ol-${index}`} className="message-markdown__list message-markdown__list-ordered">
          {lines.map((line, lineIndex) => (
            <li key={`${keyPrefix}-ol-item-${lineIndex}`}>
              {renderInlineMarkdown(line.replace(/^\s*\d+\.\s+/, ''), `${keyPrefix}-ol-${index}-${lineIndex}`)}
            </li>
          ))}
        </ol>
      )
    }

    const headingMatch = block.match(/^(#{1,3})\s+(.+)$/)

    if (headingMatch) {
      return (
        <Typography key={`${keyPrefix}-heading-${index}`} className="message-markdown__heading">
          {renderInlineMarkdown(headingMatch[2], `${keyPrefix}-heading-${index}`)}
        </Typography>
      )
    }

    if (lines.every((line) => /^>\s?/.test(line))) {
      return (
        <blockquote key={`${keyPrefix}-quote-${index}`} className="message-markdown__blockquote">
          {renderInlineMarkdown(
            lines.map((line) => line.replace(/^>\s?/, '')).join(' '),
            `${keyPrefix}-quote-${index}`,
          )}
        </blockquote>
      )
    }

    return (
      <Typography key={`${keyPrefix}-paragraph-${index}`} className="message-markdown__paragraph">
        {lines.map((line, lineIndex) => (
          <span key={`${keyPrefix}-line-${lineIndex}`}>
            {renderInlineMarkdown(line, `${keyPrefix}-line-${lineIndex}`)}
            {lineIndex < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </Typography>
    )
  })
}

function SenderAvatar({ sender }: { sender: ChatMessage['sender'] }) {
  if (sender === 'AI') {
    return (
      <Avatar className="chat-avatar chat-avatar-ai">
        <SmartToyOutlinedIcon fontSize="small" />
      </Avatar>
    )
  }

  if (sender === 'SYSTEM') {
    return null
  }

  return (
    <Avatar className="chat-avatar chat-avatar-user">
      <PersonOutlineRoundedIcon fontSize="small" />
    </Avatar>
  )
}

function MarkdownMessage({
  message,
  copiedCodeId,
  onCopy,
}: {
  message: ChatMessage
  copiedCodeId: string | null
  onCopy: (codeId: string, code: string) => void
}) {
  const segments = parseMarkdownSegments(message.content)

  return (
    <Box className="message-markdown">
      {segments.map((segment, index) => {
        const codeId = `${message.id}-code-${index}`

        if (segment.type === 'code') {
          return (
            <Box key={codeId} className="message-codeblock">
              <Box className="message-codeblock__toolbar">
                <Typography variant="caption" className="message-codeblock__lang">
                  {segment.language || 'text'}
                </Typography>
                <button
                  type="button"
                  className="message-codeblock__copy"
                  onClick={() => onCopy(codeId, segment.content)}
                  aria-label="Copy code block"
                >
                  {copiedCodeId === codeId ? (
                    <>
                      <CheckRoundedIcon fontSize="inherit" /> Copied
                    </>
                  ) : (
                    <>
                      <ContentCopyRoundedIcon fontSize="inherit" /> Copy
                    </>
                  )}
                </button>
              </Box>
              <pre className="message-codeblock__pre">
                <code>{segment.content}</code>
              </pre>
            </Box>
          )
        }

        return (
          <Box key={`${message.id}-text-${index}`}>{renderTextMarkdown(segment.content, `${message.id}-${index}`)}</Box>
        )
      })}
    </Box>
  )
}

export default function ChatPage() {
  const [config, setConfig] = useState<ChatConfig | null>(null)
  const [agent, setAgent] = useState('report-strategist')
  const [provider, setProvider] = useState<ChatProvider>('gemini')
  const [model, setModel] = useState('gemini-3.1-pro-preview')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sessionDocuments, setSessionDocuments] = useState<DocumentItem[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [composeStatus, setComposeStatus] = useState<ComposeStatus>('ready')
  const [executionMeta, setExecutionMeta] = useState<SendMessageMeta | null>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)
  const [lastFailedDraft, setLastFailedDraft] = useState<{ content: string; attachments: File[] } | null>(
    null,
  )
  const [searchParams] = useSearchParams()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const composerRef = useRef<HTMLTextAreaElement | null>(null)
  const streamingTimerRef = useRef<number | null>(null)

  const shouldStartNewSession = searchParams.get('newSession') === 'true'
  const urlSessionId = searchParams.get('sessionId')

  const activeProviderOptions = useMemo(() => {
    if (!config || config.providers.length === 0) return PROVIDER_OPTIONS
    return config.providers.map(p => ({ value: p.name as ChatProvider, label: p.name.toUpperCase() }))
  }, [config])

  const activeModelOptions = useMemo(() => {
    if (!config) return GEMINI_MODEL_OPTIONS
    const selectedProvider = config.providers.find(p => p.name === provider)
    if (!selectedProvider || selectedProvider.models.length === 0) return GEMINI_MODEL_OPTIONS
    return selectedProvider.models.map(m => ({ value: m.name, label: m.name }))
  }, [config, provider])

  const activeAgentOptions = useMemo(() => {
    if (!config || config.agents.length === 0) return [
      { value: 'report-strategist', label: 'Report Strategist' },
      { value: 'debug-operator', label: 'Debug Operator' },
      { value: 'meeting-brief', label: 'Meeting Brief' },
    ]
    return config.agents.map(a => ({ value: a.name, label: a.description || a.name }))
  }, [config])

  const stateChip = useMemo(() => {
    if (composeStatus === 'thinking') {
      return { label: 'Thinking', color: 'warning' as const }
    }

    if (composeStatus === 'streaming') {
      return { label: 'Streaming', color: 'secondary' as const }
    }

    if (composeStatus === 'error') {
      return { label: 'Error Retry', color: 'error' as const }
    }

    return { label: 'Ready', color: 'success' as const }
  }, [composeStatus])

  useEffect(() => {
    if (!activeModelOptions.some((option) => option.value === model)) {
      setModel(activeModelOptions[0].value)
    }
  }, [activeModelOptions, model])

  useEffect(() => {
    return () => {
      if (streamingTimerRef.current !== null) {
        window.clearTimeout(streamingTimerRef.current)
      }
    }
  }, [])

  const loadSessionMessages = async (nextSessionId: string) => {
    const session = await fetchChatSession(nextSessionId)
    setMessages(session.messages)
    setSessionDocuments(session.documents)
  }

  function FileThumbnail({ doc, canDownload = false }: { doc: DocumentItem | { originalName: string, size: number }, canDownload?: boolean }) {
    const isRealDoc = 'id' in doc;
    
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 0.75,
          borderRadius: 1,
          border: '1px solid var(--border-soft)',
          bgcolor: 'background.paper',
          maxWidth: 240
        }}
      >
        <InsertDriveFileOutlinedIcon sx={{ fontSize: 20, color: 'primary.main' }} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="caption" noWrap sx={{ display: 'block', fontWeight: 600 }}>
            {doc.originalName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatFileSize(doc.size)}
          </Typography>
        </Box>
        {canDownload && isRealDoc && (
          <IconButton size="small" onClick={() => void downloadDocument(doc.id, doc.originalName)}>
            <DownloadRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>
    );
  }

  useEffect(() => {
    let cancelled = false

    const bootstrap = async () => {
      setIsLoading(true)
      setError('')

      try {
        const [fetchedSessions, fetchedConfig] = await Promise.all([
          fetchChatSessions(),
          fetchChatConfig(),
        ])

        if (cancelled) {
          return
        }

        setConfig(fetchedConfig)

        if (shouldStartNewSession) {
          setSessionId(null)
          setMessages([])
          setSessionDocuments([])
          setAttachments([])
          setMessageInput('')
          return
        }

        if (urlSessionId) {
          setSessionId(urlSessionId)
          setAttachments([])
          setMessageInput('')
          await loadSessionMessages(urlSessionId)
          return
        }

        if (fetchedSessions.length === 0) {
          setSessionId(null)
          setMessages([])
          setSessionDocuments([])
          setAttachments([])
          setMessageInput('')
          return
        }

        const initialSessionId = fetchedSessions[0].id
        setSessionId(initialSessionId)
        setAttachments([])
        setMessageInput('')
        await loadSessionMessages(initialSessionId)
      } catch (requestError) {
        if (!cancelled) {
          if (isAxiosError<{ message?: string }>(requestError)) {
            setError(requestError.response?.data?.message ?? 'Unable to load chat sessions.')
          } else {
            setError('Unable to load chat sessions.')
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [shouldStartNewSession])

  const handleAttachmentPick = () => {
    fileInputRef.current?.click()
  }

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])

    if (files.length === 0) {
      return
    }

    setAttachments((current) => [...current, ...files])
    event.target.value = ''
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments((current) => current.filter((_, i) => i !== index))
  }

  const handleCopyCode = async (codeId: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCodeId(codeId)
      window.setTimeout(() => setCopiedCodeId((current) => (current === codeId ? null : current)), 1200)
    } catch {
      setCopiedCodeId(null)
    }
  }

  const handleSendMessage = async () => {
    const rawContent = messageInput.trim()
    const hasFiles = attachments.length > 0

    if (!rawContent && !hasFiles || isSending) {
      return
    }

    const requestAttachments = [...attachments]
    
    setError('')
    setIsSending(true)
    setComposeStatus('thinking')

    // Hiển thị message người dùng ngay lập tức (với text gốc)
    const optimisticMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      sessionId: sessionId ?? 'pending',
      sender: 'USER',
      content: rawContent || (hasFiles ? 'đọc và tổng hợp lại' : ''),
      documents: attachments.map((file, index) => ({
        id: `temp-${index}`,
        userId: '',
        sessionId: sessionId || '',
        fileName: file.name,
        originalName: file.name,
        filePath: '',
        mimeType: file.type,
        size: file.size
      }))
    }
    setMessages((currentMessages) => [...currentMessages, optimisticMessage])

    if (streamingTimerRef.current !== null) {
      window.clearTimeout(streamingTimerRef.current)
      streamingTimerRef.current = null
    }
    streamingTimerRef.current = window.setTimeout(() => {
      setComposeStatus((current) => (current === 'thinking' ? 'streaming' : current))
    }, 500)

    try {
      // 1. Thực hiện upload toàn bộ file và lấy ID (chỉ khi có file)
      let uploadedIds: string[] = []
      if (hasFiles) {
        try {
          const uploadPromises = requestAttachments.map(file => uploadDocument(file, sessionId || undefined))
          const uploadedDocs = await Promise.all(uploadPromises)
          uploadedIds = uploadedDocs.map(d => d.id)
        } catch (uploadErr) {
          throw new Error('Failed to upload attachments. Please try again.')
        }
      }

      // 2. Gửi tin nhắn chat kèm theo các ID tài liệu đã upload
      const response = await sendChatMessage({
        sessionId: sessionId ?? undefined,
        content: rawContent,
        provider,
        model,
        agent,
        attachments: uploadedIds,
      })

      const updatedSessionId = response.session.id
      setExecutionMeta(response.meta)
      setLastFailedDraft(null)
      setSessionId(updatedSessionId)

      // Dọn dẹp input
      setMessageInput('')
      setAttachments([])

      let refreshErrorMessage: string | null = null

      try {
        await loadSessionMessages(updatedSessionId)
      } catch (loadError) {
        refreshErrorMessage = resolveRequestErrorMessage(
          loadError,
          'Message sent, but failed to refresh conversation history.',
        )
        setMessages((currentMessages) =>
          currentMessages
            .filter((item) => item.id !== optimisticMessage.id)
            .concat(response.userMessage, response.assistantMessage),
        )
      }

      if (refreshErrorMessage) {
        setError(refreshErrorMessage)
        setComposeStatus('error')
      } else {
        setComposeStatus('ready')
      }

      if (response.assistantMessage.sender === 'SYSTEM') {
        setError(response.assistantMessage.content)
        setComposeStatus('error')
      }
    } catch (requestError) {
      const requestErrorMessage = resolveRequestErrorMessage(requestError, 'Unable to send message.')
      setMessages((currentMessages) =>
        currentMessages
          .filter((item) => item.id !== optimisticMessage.id)
          .concat({
            id: `system-${Date.now()}`,
            sessionId: sessionId ?? 'pending',
            sender: 'SYSTEM',
            content: `Unable to send message: ${requestErrorMessage}`,
          }),
      )
      setError(requestErrorMessage)
      setLastFailedDraft({
        content: rawContent,
        attachments: requestAttachments,
      })
      setComposeStatus('error')
    } finally {
      if (streamingTimerRef.current !== null) {
        window.clearTimeout(streamingTimerRef.current)
        streamingTimerRef.current = null
      }
      setIsSending(false)
    }
  }

  const handleRetryDraft = () => {
    if (!lastFailedDraft) {
      return
    }

    setMessageInput(lastFailedDraft.content)
    setAttachments(lastFailedDraft.attachments)
    setComposeStatus('ready')
    window.setTimeout(() => composerRef.current?.focus(), 0)
  }

  const handleComposerKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      void handleSendMessage()
    }
  }

  return (
    <Box className="chat-atelier">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="chat-upload-input"
        onChange={handleAttachmentChange}
      />

      <Box className="chat-grid">
        <Paper className="chat-panel chat-panel-main" elevation={0}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="subtitle1" className="chat-main__title">
              Conversation
            </Typography>
            <Chip label={stateChip.label} color={stateChip.color} size="small" />
          </Stack>

          {error ? <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setError('')}>{error}</Alert> : null}

          <Stack spacing={2} className="chat-message-stream">
            {isLoading ? (
              <Typography variant="body2" color="text.secondary">
                Loading chat history...
              </Typography>
            ) : null}

            {!isLoading && messages.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Start the conversation by asking your first question.
              </Typography>
            ) : null}

            {messages.map((message) => {
              if (message.sender === 'SYSTEM') {
                return (
                  <Box key={message.id} className="message-system-row">
                    <Typography variant="caption" className="message-system-text">
                      {message.content}
                    </Typography>
                  </Box>
                )
              }

              return (
                <Stack
                  key={message.id}
                  direction={message.sender === 'USER' ? 'row-reverse' : 'row'}
                  spacing={1.25}
                  className={`chat-message-row chat-message-row-${message.sender.toLowerCase()}`}
                >
                  <SenderAvatar sender={message.sender} />
                  <Box className={`message-bubble message-bubble-${message.sender.toLowerCase()}`}>
                    <MarkdownMessage
                      message={message}
                      copiedCodeId={copiedCodeId}
                      onCopy={handleCopyCode}
                    />
                    {message.documents && message.documents.length > 0 && (
                      <Stack spacing={1} sx={{ mt: 1.5 }}>
                        {message.documents.map((doc) => (
                          <FileThumbnail key={doc.id} doc={doc} canDownload />
                        ))}
                      </Stack>
                    )}
                  </Box>
                </Stack>
              )
            })}
            <Box className={`chat-stream-placeholder${isSending && composeStatus !== 'ready' ? ' is-active' : ''}`} aria-live="polite">
              <Avatar className="chat-avatar chat-avatar-ai">
                <SmartToyOutlinedIcon fontSize="small" />
              </Avatar>
              <Box className="message-bubble message-bubble-ai chat-stream-placeholder__bubble">
                <Box className="chat-stream-placeholder__dots" role="status" aria-label="Streaming response">
                  <span />
                  <span />
                  <span />
                </Box>
              </Box>
            </Box>
          </Stack>

          <Divider sx={{ my: 1.5 }} />

          <Paper variant="outlined" className="chat-composer">
            {attachments.length > 0 && (
              <Box sx={{ p: 1, borderBottom: '1px solid var(--border-soft)', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {attachments.map((file, index) => (
                  <Chip
                    key={`composer-file-${index}`}
                    label={file.name}
                    onDelete={() => handleRemoveAttachment(index)}
                    size="small"
                    variant="outlined"
                    icon={<InsertDriveFileOutlinedIcon sx={{ fontSize: '16px !important' }} />}
                    sx={{ maxWidth: 200 }}
                  />
                ))}
              </Box>
            )}
            <TextField
              multiline
              minRows={3}
              maxRows={8}
              placeholder="Ask your question..."
              value={messageInput}
              onChange={(event) => setMessageInput(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              fullWidth
              inputRef={composerRef}
              autoFocus
            />

            <Stack className="chat-composer__footer" direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Chip label={stateChip.label} color={stateChip.color} size="small" />
                <Typography variant="caption" color="text.secondary">
                  Ctrl + Enter to send
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<AttachFileRoundedIcon />}
                  onClick={handleAttachmentPick}
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
                    onClick={handleRetryDraft}
                  >
                    Retry
                  </Button>
                ) : null}

                <Button
                  variant="contained"
                  endIcon={<SendRoundedIcon />}
                  onClick={() => void handleSendMessage()}
                  disabled={isSending || (!messageInput.trim() && attachments.length === 0)}
                >
                  {isSending ? 'Sending...' : 'Send'}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Paper>

        <Paper className="chat-panel chat-panel-config" elevation={0}>
          <Stack spacing={1.5}>
            <Typography variant="h6">Config Panel</Typography>
            <Typography variant="caption" color="text.secondary">
              Tune runtime before sending the next message.
            </Typography>

            <ConfigField
              label="Agent"
              value={agent}
              onChange={setAgent}
              options={activeAgentOptions}
            />

            <ConfigField
              label="Provider"
              value={provider}
              onChange={(value) => setProvider(value as ChatProvider)}
              options={activeProviderOptions}
            />

            <ConfigField
              label="Model"
              value={model}
              onChange={setModel}
              options={activeModelOptions}
            />

            <Divider sx={{ my: 1 } } />

            <Stack spacing={1}>
              <Typography variant="subtitle2">Attachments</Typography>

              {sessionDocuments.length === 0 && attachments.length === 0 ? (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 1 }}>
                  No files attached
                </Typography>
              ) : (
                <Stack spacing={0.75}>
                  {/* Session documents (Already uploaded) */}
                  {sessionDocuments.map((doc) => (
                    <Box key={doc.id} sx={{ opacity: 0.9 }}>
                      <FileThumbnail doc={doc} canDownload />
                    </Box>
                  ))}

                  {/* Local attachments (To be uploaded) */}
                  {attachments.map((file, index) => (
                    <Box
                      key={`local-${file.name}-${index}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 0.75,
                        borderRadius: 1,
                        border: '1px solid var(--border-soft)',
                        bgcolor: 'action.hover',
                        animation: 'pulse 2s infinite'
                      }}
                    >
                      <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InsertDriveFileOutlinedIcon sx={{ fontSize: 20, color: 'warning.main' }} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="caption" noWrap sx={{ display: 'block', fontWeight: 600 }}>
                            {file.name} (Ready)
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatFileSize(file.size)}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton size="small" color="error" onClick={() => handleRemoveAttachment(index)}>
                        <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
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
      </Box>
    </Box>
  )
}
