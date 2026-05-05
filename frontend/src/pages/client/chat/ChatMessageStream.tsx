import { memo, useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Avatar, Box, Stack, Typography } from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import type { ChatMessage } from '../../../services/chat'
import ChatFileThumbnail from './ChatFileThumbnail'

type ComposeStatus = 'ready' | 'thinking' | 'streaming' | 'error'

interface MarkdownSegment {
  type: 'text' | 'code'
  content: string
  language?: string
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

const SenderAvatar = memo(function SenderAvatar({ sender }: { sender: ChatMessage['sender'] }) {
  if (sender === 'AI') {
    return (
      <Avatar className="chat-avatar chat-avatar-ai">
        <SmartToyOutlinedIcon fontSize="small" />
      </Avatar>
    )
  }

  return (
    <Avatar className="chat-avatar chat-avatar-user">
      <PersonOutlineRoundedIcon fontSize="small" />
    </Avatar>
  )
})

const MarkdownMessage = memo(function MarkdownMessage({ message }: { message: ChatMessage }) {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)
  const segments = useMemo(() => parseMarkdownSegments(message.content), [message.content])

  const handleCopyCode = async (codeId: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCodeId(codeId)
      window.setTimeout(() => {
        setCopiedCodeId((current) => (current === codeId ? null : current))
      }, 1200)
    } catch {
      setCopiedCodeId(null)
    }
  }

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
                  onClick={() => void handleCopyCode(codeId, segment.content)}
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
          <Box key={`${message.id}-text-${index}`}>
            {renderTextMarkdown(segment.content, `${message.id}-${index}`)}
          </Box>
        )
      })}
    </Box>
  )
})

const ChatMessageRow = memo(function ChatMessageRow({ message }: { message: ChatMessage }) {
  if (message.sender === 'SYSTEM') {
    return (
      <Box className="message-system-row">
        <Typography variant="caption" className="message-system-text">
          {message.content}
        </Typography>
      </Box>
    )
  }

  return (
    <Stack
      direction={message.sender === 'USER' ? 'row-reverse' : 'row'}
      spacing={1.25}
      className={`chat-message-row chat-message-row-${message.sender.toLowerCase()}`}
    >
      <SenderAvatar sender={message.sender} />
      <Box className={`message-bubble message-bubble-${message.sender.toLowerCase()}`}>
        <MarkdownMessage message={message} />
        {message.documents && message.documents.length > 0 ? (
          <Stack spacing={1} sx={{ mt: 1.5 }}>
            {message.documents.map((doc) => (
              <ChatFileThumbnail key={doc.id} doc={doc} canDownload />
            ))}
          </Stack>
        ) : null}
      </Box>
    </Stack>
  )
})

function ChatMessageStream({
  messages,
  isLoading,
  isSending,
  composeStatus,
}: {
  messages: ChatMessage[]
  isLoading: boolean
  isSending: boolean
  composeStatus: ComposeStatus
}) {
  const deferredMessages = useDeferredValue(messages)
  const streamRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = streamRef.current

    if (!container) {
      return
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    })
  }, [deferredMessages.length, isSending, composeStatus])

  return (
    <Stack ref={streamRef} spacing={2} className="chat-message-stream">
      {isLoading ? (
        <Typography variant="body2" color="text.secondary">
          Loading chat history...
        </Typography>
      ) : null}

      {!isLoading && deferredMessages.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Start the conversation by asking your first question.
        </Typography>
      ) : null}

      {deferredMessages.map((message) => (
        <ChatMessageRow key={message.id} message={message} />
      ))}

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
  )
}

export default memo(ChatMessageStream)
