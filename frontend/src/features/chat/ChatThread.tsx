import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import type { ChatMessage, ChatMessagePart, ChatPermissionPrompt, ChatToolActivity, ChatTurnBackup, PermissionResponse } from '../../types/appData'
import type { TableAlignment } from './markdown'
import { parseMarkdown } from './markdown'

function objectValue(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function partTextValue(part: ChatMessagePart) {
  if (typeof part.text === 'string') return part.text
  if (typeof part.content === 'string') return part.content
  if (Array.isArray(part.content)) {
    return part.content
      .map((item) => objectValue(item))
      .map((item) => stringValue(item?.text))
      .filter(Boolean)
      .join('\n')
  }
  return ''
}

function partText(message: ChatMessage, type: string) {
  return (message.parts ?? [])
    .filter((part) => part.type === type)
    .map((part) => partTextValue(part))
    .join('\n')
    .trim()
}

function formatTaskLabel(agent: string) {
  if (!agent) return 'Task'
  return `${agent.charAt(0).toUpperCase()}${agent.slice(1)} Task`
}

function formatReasoningPart(part: ChatMessagePart) {
  if (part.type === 'reasoning') {
    return partTextValue(part).trim()
  }

  if (part.type === 'subtask') {
    const detail = stringValue(part.description) || stringValue(part.prompt) || stringValue(part.command)
    if (!detail) return ''
    return `${formatTaskLabel(stringValue(part.agent))} - ${detail}`.trim()
  }

  if (part.type === 'agent') {
    const name = stringValue(part.name)
    return name ? `Agent: ${name}` : ''
  }

  return ''
}

function reasoningLines(message: ChatMessage) {
  return (message.parts ?? [])
    .map(formatReasoningPart)
    .filter((text) => text.length > 0)
}

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function toToolActivity(part: ChatMessagePart): ChatToolActivity | null {
  if (part.type !== 'tool_activity') return null
  const callId = stringValue(part.callId)
  const tool = stringValue(part.tool)
  const title = stringValue(part.title) || partTextValue(part)
  const status = stringValue(part.status)
  if (!callId || !tool || !title) return null
  return {
    id: stringValue(part.id) || `tool_${callId}`,
    callId,
    tool,
    title,
    status: status === 'pending' || status === 'success' || status === 'error' ? status : 'running',
    input: objectValue(part.input) ?? undefined,
    detail: stringValue(part.detail) || undefined,
    timestamp: typeof part.timestamp === 'number' ? part.timestamp : undefined,
  }
}

function toPermissionPrompt(part: ChatMessagePart): ChatPermissionPrompt | null {
  if (part.type !== 'permission_prompt') return null
  const id = stringValue(part.id)
  const sessionId = stringValue(part.sessionId)
  const permission = stringValue(part.permission)
  if (!id || !sessionId || !permission) return null
  const status = stringValue(part.status)
  const response = stringValue(part.response)
  return {
    id,
    sessionId,
    permission,
    title: stringValue(part.title) || partTextValue(part) || permission,
    detail: stringValue(part.detail) || permission,
    patterns: toStringArray(part.patterns),
    metadata: objectValue(part.metadata) ?? {},
    tool: objectValue(part.tool) as ChatPermissionPrompt['tool'],
    always: toStringArray(part.always),
    status: status === 'answered' || status === 'responding' ? status : 'pending',
    response: response === 'once' || response === 'always' || response === 'reject' ? response : undefined,
  }
}

function runtimeParts(message: ChatMessage) {
  return (message.parts ?? [])
    .map((part) => toToolActivity(part) ?? toPermissionPrompt(part))
    .filter((part): part is ChatToolActivity | ChatPermissionPrompt => !!part)
}

function toChatBackup(part: ChatMessagePart): ChatTurnBackup | null {
  if (part.type !== 'chat_backup') return null
  const backupRoot = stringValue(part.backupRoot)
  const messageId = stringValue(part.messageId)
  const rawFiles = Array.isArray(part.files) ? part.files : []
  if (!backupRoot || rawFiles.length === 0) return null

  return {
    backupRoot,
    createdAt: stringValue(part.createdAt),
    sessionId: stringValue(part.sessionId),
    messageId,
    files: rawFiles
      .map((item) => objectValue(item))
      .filter((item): item is Record<string, unknown> => !!item)
      .map((item) => ({
        id: stringValue(item.id),
        filePath: stringValue(item.filePath),
        status: stringValue(item.status),
        additions: typeof item.additions === 'number' ? item.additions : 0,
        deletions: typeof item.deletions === 'number' ? item.deletions : 0,
        currentBackupPath: stringValue(item.currentBackupPath),
        headBackupPath: stringValue(item.headBackupPath),
        patchBackupPath: stringValue(item.patchBackupPath),
      }))
      .filter((item) => item.filePath),
  }
}

function chatBackups(message: ChatMessage) {
  return (message.parts ?? [])
    .map(toChatBackup)
    .filter((backup): backup is ChatTurnBackup => !!backup)
}

function tableAlignmentClass(alignment: TableAlignment) {
  if (alignment === 'left') return 'align-left'
  if (alignment === 'center') return 'align-center'
  if (alignment === 'right') return 'align-right'
  return undefined
}

function renderInline(text: string) {
  const nodes: ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g
  let cursor = 0

  for (const match of text.matchAll(pattern)) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index))
    }

    const value = match[0]
    if (value.startsWith('**')) {
      nodes.push(<strong key={`${value}-${match.index}`}>{value.slice(2, -2)}</strong>)
    } else if (value.startsWith('`')) {
      nodes.push(<code key={`${value}-${match.index}`}>{value.slice(1, -1)}</code>)
    } else {
      nodes.push(<em key={`${value}-${match.index}`}>{value.slice(1, -1)}</em>)
    }
    cursor = match.index + value.length
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor))
  }

  return nodes
}

function PlainMessageText({ text, streaming }: { text: string; streaming?: boolean }) {
  if (!text) {
    return <p className="chat-placeholder-text">{streaming ? 'Receiving response...' : 'No content returned.'}</p>
  }

  return (
    <div className="chat-text-block">
      {text.split(/\n{2,}/).map((block, index) => (
        <p key={`${block.slice(0, 24)}-${index}`}>{renderInline(block)}</p>
      ))}
      {streaming && <span className="stream-caret" aria-hidden="true" />}
    </div>
  )
}

function MarkdownMessageText({ text, streaming }: { text: string; streaming?: boolean }) {
  if (!text) {
    return <p className="chat-placeholder-text">{streaming ? 'Receiving response...' : 'No content returned.'}</p>
  }

  return (
    <div className="chat-markdown-block">
      {parseMarkdown(text).map((block, index) => {
        if (block.type === 'heading') {
          const HeadingTag = `h${Math.min(block.level + 1, 4)}` as 'h2' | 'h3' | 'h4'
          return <HeadingTag key={`${block.text}-${index}`}>{renderInline(block.text)}</HeadingTag>
        }
        if (block.type === 'quote') {
          return <blockquote key={`${block.text}-${index}`}>{renderInline(block.text)}</blockquote>
        }
        if (block.type === 'code') {
          return <pre key={`${block.text}-${index}`}><code>{block.text}</code></pre>
        }
        if (block.type === 'list') {
          const ListTag = block.ordered ? 'ol' : 'ul'
          return (
            <ListTag key={`${block.items.join('-')}-${index}`}>
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{renderInline(item)}</li>
              ))}
            </ListTag>
          )
        }
        if (block.type === 'table') {
          return (
            <div className="chat-table-scroll" key={`${block.headers.join('-')}-${index}`}>
              <table>
                <thead>
                  <tr>
                    {block.headers.map((header, cellIndex) => (
                      <th className={tableAlignmentClass(block.alignments[cellIndex])} key={`${header}-${cellIndex}`}>
                        {renderInline(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`${row.join('-')}-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td className={tableAlignmentClass(block.alignments[cellIndex])} key={`${cell}-${cellIndex}`}>
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        return <p key={`${block.text}-${index}`}>{renderInline(block.text)}</p>
      })}
      {streaming && <span className="stream-caret" aria-hidden="true" />}
    </div>
  )
}

function RuntimeToolLine({ activity }: { activity: ChatToolActivity }) {
  const marker = activity.tool.toLowerCase().includes('web') ? '%' : '→'
  return (
    <div className={`chat-tool-line ${activity.status}`}>
      <span>{marker}</span>
      <strong>{activity.title}</strong>
      {activity.detail && <em>{activity.detail}</em>}
    </div>
  )
}

function metadataRows(metadata: Record<string, unknown>) {
  return Object.entries(metadata)
    .filter(([, value]) => typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
    .slice(0, 4)
}

function PermissionPromptCard({
  prompt,
  onRespondPermission,
}: {
  prompt: ChatPermissionPrompt
  onRespondPermission?: (prompt: ChatPermissionPrompt, response: PermissionResponse) => void
}) {
  const disabled = prompt.status !== 'pending' || !onRespondPermission

  return (
    <div className={`chat-permission-card ${prompt.status}`}>
      <div className="chat-permission-copy">
        <span>Permission required</span>
        <strong>{prompt.title}</strong>
        {prompt.patterns.length > 0 && <code>{prompt.patterns.join('\n')}</code>}
        {metadataRows(prompt.metadata).map(([key, value]) => (
          <p key={key}>{key}: {String(value)}</p>
        ))}
      </div>
      <div className="chat-permission-actions">
        <button type="button" disabled={disabled} onClick={() => onRespondPermission?.(prompt, 'once')}>Allow once</button>
        <button type="button" disabled={disabled} onClick={() => onRespondPermission?.(prompt, 'always')}>Allow always</button>
        <button type="button" disabled={disabled} onClick={() => onRespondPermission?.(prompt, 'reject')}>Reject</button>
      </div>
    </div>
  )
}

function ChatBackupNotice({ backup }: { backup: ChatTurnBackup }) {
  return (
    <div className="chat-backup-notice">
      <span>Backup saved</span>
      <strong>{backup.files.length} changed file{backup.files.length === 1 ? '' : 's'}</strong>
      <code>{backup.backupRoot}</code>
    </div>
  )
}

function ChatRuntimeEvents({
  message,
  onRespondPermission,
}: {
  message: ChatMessage
  onRespondPermission?: (prompt: ChatPermissionPrompt, response: PermissionResponse) => void
}) {
  const parts = runtimeParts(message)
  const backups = chatBackups(message)
  if (parts.length === 0 && backups.length === 0) return null

  return (
    <div className="chat-runtime-events" aria-label="OpenCode runtime events">
      {backups.map((backup) => (
        <ChatBackupNotice key={`backup-${backup.messageId}-${backup.backupRoot}`} backup={backup} />
      ))}
      {parts.map((part) => (
        'permission' in part
          ? <PermissionPromptCard key={`permission-${part.id}`} prompt={part} onRespondPermission={onRespondPermission} />
          : <RuntimeToolLine key={`tool-${part.callId}`} activity={part} />
      ))}
    </div>
  )
}

function AssistantMessage({
  message,
  onRespondPermission,
}: {
  message: ChatMessage
  onRespondPermission?: (prompt: ChatPermissionPrompt, response: PermissionResponse) => void
}) {
  const thinkingLines = reasoningLines(message)
  const mainText = partText(message, 'text') || message.content
  const showThinking = thinkingLines.length > 0

  return (
    <article className="chat-response assistant">
      {showThinking && (
        <div className="chat-thinking" aria-label="Reasoning">
          {thinkingLines.map((line, index) => (
            <PlainMessageText text={line} key={`${line.slice(0, 24)}-${index}`} />
          ))}
        </div>
      )}
      <div className="chat-main-message">
        <MarkdownMessageText text={mainText} streaming={message.streaming} />
        <ChatRuntimeEvents message={message} onRespondPermission={onRespondPermission} />
      </div>
    </article>
  )
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <article className="chat-request user">
      <div className="chat-request-bubble">
        <p>{message.content}</p>
      </div>
    </article>
  )
}

export function ChatThread({
  messages,
  onRespondPermission,
}: {
  messages: ChatMessage[]
  onRespondPermission?: (prompt: ChatPermissionPrompt, response: PermissionResponse) => void
}) {
  const threadRef = useRef<HTMLDivElement | null>(null)
  const latestMessageRef = useRef<HTMLDivElement | null>(null)
  const hasStreamingMessage = messages.some((message) => message.streaming)

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({
      block: 'start',
      behavior: hasStreamingMessage ? 'auto' : 'smooth',
    })
  }, [hasStreamingMessage, messages.length])

  return (
    <div className="chat-thread" aria-live="polite" ref={threadRef}>
      {messages.map((message, index) => (
        <div className="chat-thread-item" key={message.id} ref={index === messages.length - 1 ? latestMessageRef : undefined}>
          {message.role === 'assistant'
            ? <AssistantMessage message={message} onRespondPermission={onRespondPermission} />
            : <UserMessage message={message} />}
        </div>
      ))}
    </div>
  )
}
