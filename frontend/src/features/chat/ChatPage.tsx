import { useEffect, useState } from 'react'
import { getChatSession, listChatSessions } from '../../services/appDataService'
import type { AgentItem, ChatContextReference, ChatMessage, ChatMessagePart, ChatPermissionPrompt, ChatResponse, ChatSession, ChatStreamEvent, ChatSubmitOptions, ChatToolActivity, CommandItem, PermissionResponse, SkillItem } from '../../types/appData'
import { DataState } from '../../components/common/Primitives'
import { ChatComposer } from './ChatComposer'
import { ChatThread } from './ChatThread'

function appendMessagePart(message: ChatMessage, type: 'reasoning' | 'text', delta: string): ChatMessage {
  const parts = [...(message.parts ?? [])]
  const existingIndex = parts.findIndex((part) => part.type === type)
  if (existingIndex === -1) {
    parts.push({ type, text: delta })
  } else {
    parts[existingIndex] = {
      ...parts[existingIndex],
      text: `${typeof parts[existingIndex].text === 'string' ? parts[existingIndex].text : ''}${delta}`,
    }
  }

  return {
    ...message,
    content: type === 'text' ? `${message.content}${delta}` : message.content,
    parts,
    streaming: true,
  }
}

function upsertPart(message: ChatMessage, nextPart: ChatMessagePart, matches: (part: ChatMessagePart) => boolean): ChatMessage {
  const parts = [...(message.parts ?? [])]
  const existingIndex = parts.findIndex(matches)
  if (existingIndex === -1) {
    parts.push(nextPart)
  } else {
    parts[existingIndex] = {
      ...parts[existingIndex],
      ...nextPart,
    }
  }

  return {
    ...message,
    parts,
    streaming: true,
  }
}

function upsertToolActivity(message: ChatMessage, activity: ChatToolActivity): ChatMessage {
  return upsertPart(message, {
    ...activity,
    type: 'tool_activity',
    text: activity.title,
  }, (part) => part.type === 'tool_activity' && part.callId === activity.callId)
}

function upsertPermissionPrompt(message: ChatMessage, prompt: ChatPermissionPrompt): ChatMessage {
  return upsertPart(message, {
    ...prompt,
    type: 'permission_prompt',
    text: prompt.title,
  }, (part) => part.type === 'permission_prompt' && part.id === prompt.id)
}

function updatePermissionPart(message: ChatMessage, permissionId: string, patch: Partial<ChatPermissionPrompt>): ChatMessage {
  if (!message.parts?.some((part) => part.type === 'permission_prompt' && part.id === permissionId)) return message
  return {
    ...message,
    parts: message.parts.map((part) => (
      part.type === 'permission_prompt' && part.id === permissionId
        ? { ...part, ...patch }
        : part
    )),
    streaming: true,
  }
}

export function ChatPage({
  projectId,
  activeSessionId,
  startFresh = false,
  loading,
  error,
  onRetry,
  onActiveSessionChange,
  onSubmitMessage,
  onStreamMessage,
  onRespondPermission,
  onSearchReferences,
  models,
  agents,
  commands,
  skills,
}: {
  projectId: string | undefined
  activeSessionId: string | null
  startFresh?: boolean
  loading: boolean
  error: string | null
  onRetry: () => void
  onActiveSessionChange: (sessionId: string | null) => void
  onSubmitMessage: (sessionId: string | null, message: string, options?: ChatSubmitOptions) => Promise<ChatResponse>
  onStreamMessage?: (sessionId: string | null, message: string, options?: ChatSubmitOptions, onEvent?: (event: ChatStreamEvent) => void, signal?: AbortSignal) => Promise<ChatResponse>
  onRespondPermission?: (sessionId: string, permissionId: string, response: PermissionResponse) => Promise<void>
  onSearchReferences: (query: string) => Promise<ChatContextReference[]>
  models: string[]
  agents: AgentItem[]
  commands: CommandItem[]
  skills: SkillItem[]
}) {
  const [session, setSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatError, setChatError] = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(false)
  const [resumeSuppressed, setResumeSuppressed] = useState(startFresh)
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedAgent, setSelectedAgent] = useState('')
  const [streamAbortController, setStreamAbortController] = useState<AbortController | null>(null)

  const handleCancelStreaming = () => {
    streamAbortController?.abort()
  }

  const handleRespondPermission = async (prompt: ChatPermissionPrompt, response: PermissionResponse) => {
    if (!onRespondPermission) return
    setMessages((current) => current.map((item) => updatePermissionPart(item, prompt.id, { status: 'responding', response })))
    setChatError(null)
    try {
      await onRespondPermission(prompt.sessionId, prompt.id, response)
      setMessages((current) => current.map((item) => updatePermissionPart(item, prompt.id, { status: 'answered', response })))
    } catch (caughtError) {
      setMessages((current) => current.map((item) => updatePermissionPart(item, prompt.id, { status: 'pending', response: undefined })))
      setChatError(caughtError instanceof Error ? caughtError.message : 'Unable to respond to permission request')
    }
  }

  useEffect(() => {
    setResumeSuppressed(startFresh)
  }, [startFresh])

  useEffect(() => {
    if (!projectId) return
    let active = true
    const loadActiveSession = async () => {
      setChatError(null)
      setSessionLoading(true)
      try {
        if (activeSessionId) {
          const detail = await getChatSession(projectId, activeSessionId)
          if (!active) return
          setSession(detail.session)
          setMessages(detail.messages)
          setSelectedModel(detail.session.model ?? '')
          setSelectedAgent(detail.session.agent ?? '')
          setResumeSuppressed(false)
          return
        }

        if (resumeSuppressed) {
          setSession(null)
          setMessages([])
          setSelectedModel('')
          setSelectedAgent('')
          return
        }

        const sessions = await listChatSessions(projectId, 'active')
        const latest = sessions[0]
        if (!active) return
        if (latest) {
          onActiveSessionChange(latest.id)
        } else {
          setSession(null)
          setMessages([])
        }
      } catch (caughtError) {
        if (active) {
          setChatError(caughtError instanceof Error ? caughtError.message : 'Unable to load chat session')
        }
      } finally {
        if (active) {
          setSessionLoading(false)
        }
      }
    }

    void loadActiveSession()
    return () => {
      active = false
    }
  }, [activeSessionId, onActiveSessionChange, projectId, resumeSuppressed])

  const handleSubmitMessage = async (message: string, options: ChatSubmitOptions = {}) => {
    const optimisticMessage: ChatMessage = {
      id: `local_${Date.now()}`,
      sessionId: session?.id ?? activeSessionId ?? 'pending',
      role: 'user',
      content: message,
      parts: [{ type: 'text', text: message }],
      createdAt: new Date().toISOString(),
    }
    const assistantPlaceholder: ChatMessage = {
      id: `local_assistant_${Date.now()}`,
      sessionId: session?.id ?? activeSessionId ?? 'pending',
      role: 'assistant',
      content: '',
      parts: [
        { type: 'reasoning', text: '' },
        { type: 'text', text: '' },
      ],
      createdAt: new Date().toISOString(),
      streaming: true,
    }
    setMessages((current) => [...current, optimisticMessage])
    setChatError(null)
    let assistantMessageId = assistantPlaceholder.id
    const streamedAssistantIds = new Set([assistantPlaceholder.id])
    let requestSessionId = session?.id ?? activeSessionId
    try {
      if (!onStreamMessage) {
        const response = await onSubmitMessage(requestSessionId, message, options)
        requestSessionId = response.sessionId
        onActiveSessionChange(response.sessionId)
        setResumeSuppressed(false)
        setMessages((current) => [
          ...current.filter((item) => item.id !== optimisticMessage.id),
          response.userMessage,
          response.assistantMessage,
        ])
        return
      }

      let userMessageId = optimisticMessage.id
      const streamedUserIds = new Set([optimisticMessage.id])
      setMessages((current) => [...current, assistantPlaceholder])
      const abortController = new AbortController()
      setStreamAbortController(abortController)
      const response = await onStreamMessage(requestSessionId, message, options, (event) => {
        if (event.type === 'user') {
          requestSessionId = event.message.sessionId
          streamedUserIds.add(userMessageId)
          userMessageId = event.message.id
          streamedUserIds.add(userMessageId)
          setMessages((current) => current.map((item) => item.id === optimisticMessage.id ? event.message : item))
        }
        if (event.type === 'assistant_start') {
          requestSessionId = event.message.sessionId
          streamedAssistantIds.add(assistantMessageId)
          const previousAssistantId = assistantMessageId
          assistantMessageId = event.message.id
          streamedAssistantIds.add(assistantMessageId)
          setMessages((current) => current.map((item) => (
            item.id === assistantPlaceholder.id || item.id === previousAssistantId
              ? { ...event.message, streaming: true }
              : item
          )))
        }
        if (event.type === 'thinking_delta') {
          setMessages((current) => current.map((item) => (
            streamedAssistantIds.has(item.id) ? appendMessagePart(item, 'reasoning', event.delta) : item
          )))
        }
        if (event.type === 'text_delta') {
          setMessages((current) => current.map((item) => (
            streamedAssistantIds.has(item.id) ? appendMessagePart(item, 'text', event.delta) : item
          )))
        }
        if (event.type === 'tool_activity') {
          setMessages((current) => current.map((item) => (
            streamedAssistantIds.has(item.id) ? upsertToolActivity(item, event.activity) : item
          )))
        }
        if (event.type === 'permission_prompt') {
          setMessages((current) => current.map((item) => (
            streamedAssistantIds.has(item.id) ? upsertPermissionPrompt(item, event.prompt) : item
          )))
        }
        if (event.type === 'permission_resolved') {
          setMessages((current) => current.map((item) => (
            streamedAssistantIds.has(item.id)
              ? updatePermissionPart(item, event.permissionId, { status: 'answered', response: event.response })
              : item
          )))
        }
      }, abortController.signal)
      onActiveSessionChange(response.sessionId)
      setResumeSuppressed(false)
      setMessages((current) => [
        ...current.filter((item) => (
          !streamedUserIds.has(item.id)
          && item.id !== response.userMessage.id
          && !streamedAssistantIds.has(item.id)
          && item.id !== response.assistantMessage.id
        )),
        response.userMessage,
        { ...response.assistantMessage, streaming: false },
      ])
    } catch (caughtError) {
      if (caughtError instanceof Error && caughtError.name === 'AbortError') {
        setMessages((current) => current.map((item) => (
          streamedAssistantIds.has(item.id)
            ? {
              ...item,
              streaming: false,
              content: item.content || 'Stopped by user.',
              parts: item.parts?.some((part) => part.type === 'text' && typeof part.text === 'string' && part.text.trim())
                ? item.parts
                : [{ type: 'text', text: 'Stopped by user.' }],
            }
            : item
        )))
        setChatError(null)
        return
      }
      setChatError(caughtError instanceof Error ? caughtError.message : 'OpenCode chat failed')
      if (projectId && requestSessionId) {
        try {
          const detail = await getChatSession(projectId, requestSessionId)
          setSession(detail.session)
          setMessages(detail.messages)
          setSelectedModel(detail.session.model ?? '')
          setSelectedAgent(detail.session.agent ?? '')
          setResumeSuppressed(false)
        } catch {
          // Keep the streamed fallback state when the history refresh is unavailable.
        }
      }
      throw caughtError
    } finally {
      setStreamAbortController(null)
    }
  }

  return (
    <section className={`chat-empty-state${messages.length > 0 ? ' has-messages' : ''}`} aria-label="Chat page">
      <div className="chat-panel">
        <DataState loading={loading} error={error} onRetry={onRetry} compact />
        {messages.length === 0 && (
          <div className="chat-heading">
            <h2>Ask OpenCode about this workspace</h2>
          </div>
        )}
        {sessionLoading && <div className="data-state compact">Loading session history...</div>}
        {messages.length > 0 && <ChatThread messages={messages} onRespondPermission={handleRespondPermission} />}
        {chatError && <div className="chat-inline-error">{chatError}</div>}
        <ChatComposer
          projectId={projectId}
          models={models}
          agents={agents}
          commands={commands}
          skills={skills}
          selectedModel={selectedModel}
          selectedAgent={selectedAgent}
          onSelectedModelChange={setSelectedModel}
          onSelectedAgentChange={setSelectedAgent}
          onSearchReferences={onSearchReferences}
          onSubmitMessage={handleSubmitMessage}
          streaming={streamAbortController !== null}
          onCancelStreaming={handleCancelStreaming}
        />
      </div>
    </section>
  )
}
