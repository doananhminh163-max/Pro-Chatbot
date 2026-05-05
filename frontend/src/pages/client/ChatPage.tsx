import {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEventHandler,
} from 'react'
import { isAxiosError } from 'axios'
import { Alert, Box, Chip, Paper, Stack, Typography } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
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
import { uploadDocument, type DocumentItem } from '../../services/documents'
import ChatComposer from './chat/ChatComposer'
import ChatConfigPanel from './chat/ChatConfigPanel'
import ChatMessageStream from './chat/ChatMessageStream'

const MAX_PROMPT_CHARACTERS = 2000
const MAX_USER_MESSAGES_PER_SESSION = 50
const MAX_ATTACHMENT_SIZE_BYTES = 20 * 1024 * 1024

const DEFAULT_PROVIDER_OPTIONS: Array<{ value: ChatProvider; label: string }> = [
  { value: 'gemini', label: 'Gemini CLI' },
]

const DEFAULT_MODEL_OPTIONS = [
  { value: 'gemini-3.1-pro-preview', label: 'gemini-3.1-pro-preview' },
  { value: 'gemini-3-flash-preview', label: 'gemini-3-flash-preview' },
  { value: 'gemini-3.1-flash-lite-preview', label: 'gemini-3.1-flash-lite-preview' },
  { value: 'gemini-2.5-pro', label: 'gemini-2.5-pro' },
  { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
  { value: 'gemini-2.5-flash-lite', label: 'gemini-2.5-flash-lite' },
]

const DEFAULT_AGENT_OPTIONS = [
  { value: 'report-strategist', label: 'Report Strategist' },
  { value: 'debug-operator', label: 'Debug Operator' },
  { value: 'meeting-brief', label: 'Meeting Brief' },
]

type ComposeStatus = 'ready' | 'thinking' | 'streaming' | 'error'

function resolveRequestErrorMessage(requestError: unknown, fallback: string) {
  if (isAxiosError<{ message?: string }>(requestError)) {
    return requestError.response?.data?.message ?? requestError.message ?? fallback
  }

  if (requestError instanceof Error && requestError.message) {
    return requestError.message
  }

  return fallback
}

function toOptimisticMessage(sessionId: string | null, content: string, attachments: File[]): ChatMessage {
  return {
    id: `local-${Date.now()}`,
    sessionId: sessionId ?? 'pending',
    sender: 'USER',
    content: content || (attachments.length > 0 ? 'Read the attached files and summarize them.' : ''),
    documents: attachments.map((file, index) => ({
      id: `temp-${index}`,
      userId: '',
      sessionId: sessionId ?? '',
      fileName: file.name,
      originalName: file.name,
      filePath: '',
      mimeType: file.type,
      size: file.size,
    })),
  }
}

export default function ChatPage() {
  const [config, setConfig] = useState<ChatConfig | null>(null)
  const [agent, setAgent] = useState('report-strategist')
  const [provider, setProvider] = useState<ChatProvider>('gemini')
  const [model, setModel] = useState('gemini-3.1-pro-preview')
  const [memoryEnabled, setMemoryEnabled] = useState(true)
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
  const [lastFailedDraft, setLastFailedDraft] = useState<{ content: string; attachments: File[] } | null>(null)
  const [searchParams] = useSearchParams()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const composerRef = useRef<HTMLTextAreaElement | null>(null)
  const streamingTimerRef = useRef<number | null>(null)

  const shouldStartNewSession = searchParams.get('newSession') === 'true'
  const urlSessionId = searchParams.get('sessionId')

  const activeProviderOptions = useMemo(() => {
    if (!config || config.providers.length === 0) {
      return DEFAULT_PROVIDER_OPTIONS
    }

    return config.providers.map((item) => ({
      value: item.name as ChatProvider,
      label: item.name.toUpperCase(),
    }))
  }, [config])

  const activeModelOptions = useMemo(() => {
    if (!config) {
      return DEFAULT_MODEL_OPTIONS
    }

    const selectedProvider = config.providers.find((item) => item.name === provider)

    if (!selectedProvider || selectedProvider.models.length === 0) {
      return DEFAULT_MODEL_OPTIONS
    }

    return selectedProvider.models.map((item) => ({
      value: item.name,
      label: item.name,
    }))
  }, [config, provider])

  const activeAgentOptions = useMemo(() => {
    if (!config || config.agents.length === 0) {
      return DEFAULT_AGENT_OPTIONS
    }

    return config.agents.map((item) => ({
      value: item.name,
      label: item.description || item.name,
    }))
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

  const userMessageCount = useMemo(
    () => messages.filter((message) => message.sender === 'USER').length,
    [messages],
  )
  const promptLength = messageInput.length
  const isPromptTooLong = promptLength > MAX_PROMPT_CHARACTERS
  const isUserMessageLimitReached = userMessageCount >= MAX_USER_MESSAGES_PER_SESSION

  useEffect(() => {
    if (!activeProviderOptions.some((option) => option.value === provider)) {
      setProvider(activeProviderOptions[0].value)
    }
  }, [activeProviderOptions, provider])

  useEffect(() => {
    if (!activeModelOptions.some((option) => option.value === model)) {
      setModel(activeModelOptions[0].value)
    }
  }, [activeModelOptions, model])

  useEffect(() => {
    if (!activeAgentOptions.some((option) => option.value === agent)) {
      setAgent(activeAgentOptions[0].value)
    }
  }, [activeAgentOptions, agent])

  useEffect(() => {
    return () => {
      if (streamingTimerRef.current !== null) {
        window.clearTimeout(streamingTimerRef.current)
      }
    }
  }, [])

  const applySessionSnapshot = (nextMessages: ChatMessage[], nextDocuments: DocumentItem[]) => {
    startTransition(() => {
      setMessages(nextMessages)
      setSessionDocuments(nextDocuments)
    })
  }

  const resetDraftState = () => {
    setAttachments([])
    setMessageInput('')
  }

  const loadSessionMessages = async (nextSessionId: string) => {
    const session = await fetchChatSession(nextSessionId)
    applySessionSnapshot(session.messages, session.documents)
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
          applySessionSnapshot([], [])
          resetDraftState()
          return
        }

        const initialSessionId = urlSessionId ?? fetchedSessions[0]?.id ?? null

        if (!initialSessionId) {
          setSessionId(null)
          applySessionSnapshot([], [])
          resetDraftState()
          return
        }

        setSessionId(initialSessionId)
        resetDraftState()

        const session = await fetchChatSession(initialSessionId)

        if (cancelled) {
          return
        }

        applySessionSnapshot(session.messages, session.documents)
      } catch (requestError) {
        if (!cancelled) {
          setError(resolveRequestErrorMessage(requestError, 'Unable to load chat sessions.'))
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
  }, [shouldStartNewSession, urlSessionId])

  const handleAttachmentPick = () => {
    fileInputRef.current?.click()
  }

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])

    if (files.length === 0) {
      return
    }

    const validFiles = files.filter((file) => file.size <= MAX_ATTACHMENT_SIZE_BYTES)
    const oversizedFiles = files.filter((file) => file.size > MAX_ATTACHMENT_SIZE_BYTES)

    if (oversizedFiles.length > 0) {
      setError(
        `Each attachment must be 20 MB or smaller. Oversized: ${oversizedFiles.map((file) => file.name).join(', ')}`,
      )
    }

    if (validFiles.length > 0) {
      setAttachments((current) => current.concat(validFiles))
    }

    event.target.value = ''
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments((current) => current.filter((_, currentIndex) => currentIndex !== index))
  }

  const handleSendMessage = async () => {
    const rawContent = messageInput.trim()
    const hasFiles = attachments.length > 0

    if ((!rawContent && !hasFiles) || isSending) {
      return
    }

    if (isUserMessageLimitReached) {
      setError(`This session already has ${MAX_USER_MESSAGES_PER_SESSION} user messages. Start a new session to continue.`)
      setComposeStatus('error')
      return
    }

    if (isPromptTooLong) {
      setError(`Prompt text is limited to ${MAX_PROMPT_CHARACTERS} characters. Upload a file for more content.`)
      setComposeStatus('error')
      return
    }

    const requestAttachments = [...attachments]
    const optimisticMessage = toOptimisticMessage(sessionId, rawContent, requestAttachments)

    setError('')
    setIsSending(true)
    setComposeStatus('thinking')
    setMessages((current) => current.concat(optimisticMessage))

    if (streamingTimerRef.current !== null) {
      window.clearTimeout(streamingTimerRef.current)
      streamingTimerRef.current = null
    }

    streamingTimerRef.current = window.setTimeout(() => {
      setComposeStatus((current) => (current === 'thinking' ? 'streaming' : current))
    }, 500)

    try {
      let uploadedIds: string[] = []

      if (hasFiles) {
        const uploadedDocs = await Promise.all(
          requestAttachments.map((file) => uploadDocument(file, sessionId ?? undefined)),
        )
        uploadedIds = uploadedDocs.map((item) => item.id)
      }

      const response = await sendChatMessage({
        sessionId: sessionId ?? undefined,
        content: rawContent,
        provider,
        model,
        memoryEnabled,
        agent,
        attachments: uploadedIds,
      })

      const updatedSessionId = response.session.id
      setExecutionMeta(response.meta)
      setLastFailedDraft(null)
      setSessionId(updatedSessionId)
      resetDraftState()

      try {
        await loadSessionMessages(updatedSessionId)
        setComposeStatus(response.assistantMessage.sender === 'SYSTEM' ? 'error' : 'ready')
      } catch (loadError) {
        const fallbackMessages = [response.userMessage, response.assistantMessage].filter(
          (message): message is ChatMessage => message !== null,
        )

        setError(
          resolveRequestErrorMessage(
            loadError,
            'Message sent, but failed to refresh conversation history.',
          ),
        )
        setComposeStatus('error')
        startTransition(() => {
          setMessages((current) =>
            current
              .filter((item) => item.id !== optimisticMessage.id)
              .concat(fallbackMessages),
          )
        })
      }

      if (response.assistantMessage.sender === 'SYSTEM') {
        setError(response.assistantMessage.content)
      }
    } catch (requestError) {
      const requestErrorMessage = resolveRequestErrorMessage(requestError, 'Unable to send message.')

      startTransition(() => {
        setMessages((current) =>
          current
            .filter((item) => item.id !== optimisticMessage.id)
            .concat({
              id: `system-${Date.now()}`,
              sessionId: sessionId ?? 'pending',
              sender: 'SYSTEM',
              content: `Unable to send message: ${requestErrorMessage}`,
            }),
        )
      })

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
            <Box>
              <Typography variant="h6" className="chat-main__title">
                Conversation
              </Typography>
            </Box>
            <Chip label={stateChip.label} color={stateChip.color} size="small" />
          </Stack>

          {error ? (
            <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setError('')}>
              {error}
            </Alert>
          ) : null}

          <ChatMessageStream
            messages={messages}
            isLoading={isLoading}
            isSending={isSending}
            composeStatus={composeStatus}
          />

          <ChatComposer
            attachments={attachments}
            composerRef={composerRef}
            composeStatus={composeStatus}
            isPromptTooLong={isPromptTooLong}
            isSending={isSending}
            isUserMessageLimitReached={isUserMessageLimitReached}
            maxPromptCharacters={MAX_PROMPT_CHARACTERS}
            maxUserMessagesPerSession={MAX_USER_MESSAGES_PER_SESSION}
            messageInput={messageInput}
            onAttachmentPick={handleAttachmentPick}
            onChangeMessage={setMessageInput}
            onKeyDown={handleComposerKeyDown}
            onRemoveAttachment={handleRemoveAttachment}
            onRetryDraft={handleRetryDraft}
            onSendMessage={() => void handleSendMessage()}
            promptLength={promptLength}
            userMessageCount={userMessageCount}
          />
        </Paper>

        <ChatConfigPanel
          activeAgentOptions={activeAgentOptions}
          activeModelOptions={activeModelOptions}
          activeProviderOptions={activeProviderOptions}
          agent={agent}
          attachments={attachments}
          executionMeta={executionMeta}
          memoryEnabled={memoryEnabled}
          model={model}
          onChangeAgent={setAgent}
          onChangeMemory={setMemoryEnabled}
          onChangeModel={setModel}
          onChangeProvider={setProvider}
          onRemoveAttachment={handleRemoveAttachment}
          provider={provider}
          sessionDocuments={sessionDocuments}
        />
      </Box>
    </Box>
  )
}
