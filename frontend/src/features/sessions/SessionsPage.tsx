import { useCallback, useEffect, useMemo, useState } from 'react'
import { Archive, Clock, Download, Edit3, MessageSquare, Search, Trash2 } from 'lucide-react'
import {
  deleteChatSession,
  exportChatSession,
  listChatSessions,
  updateChatSession,
} from '../../services/appDataService'
import type { AppState, ChatSession, StatusTone } from '../../types/appData'
import { Card, EmptyState, StatusBadge } from '../../components/common/Primitives'

export function SessionsPage({
  data,
  onOpenChatSession,
  onRefreshAppData,
}: {
  data: AppState
  onOpenChatSession: (sessionId: string) => void
  onRefreshAppData: () => void
}) {
  const projectId = data.project.id
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [listLoading, setListLoading] = useState(false)

  const loadSessions = useCallback(async () => {
    setListLoading(true)
    setSessionError(null)
    try {
      setSessions(await listChatSessions(projectId, statusFilter))
    } catch (caughtError) {
      setSessionError(caughtError instanceof Error ? caughtError.message : 'Unable to load sessions')
    } finally {
      setListLoading(false)
    }
  }, [projectId, statusFilter])

  useEffect(() => {
    void loadSessions()
  }, [loadSessions])

  const filteredSessions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    if (!normalizedSearch) return sessions
    return sessions.filter((session) => [
      session.title,
      session.id,
      session.openCodeSessionId,
      session.model,
      session.agent,
      session.lastMessagePreview,
    ].filter(Boolean).some((value) => value?.toLowerCase().includes(normalizedSearch)))
  }, [searchTerm, sessions])

  const refreshSessions = async () => {
    await loadSessions()
    onRefreshAppData()
  }

  const handleRenameSession = async (session: ChatSession) => {
    const title = window.prompt('Session title', session.title)
    if (!title?.trim() || title.trim() === session.title) return
    try {
      setSessionError(null)
      await updateChatSession(projectId, session.id, { title: title.trim() })
      await refreshSessions()
    } catch (caughtError) {
      setSessionError(caughtError instanceof Error ? caughtError.message : 'Unable to rename session')
    }
  }

  const handleArchiveSession = async (session: ChatSession) => {
    try {
      setSessionError(null)
      await updateChatSession(projectId, session.id, { status: session.status === 'archived' ? 'active' : 'archived' })
      await refreshSessions()
    } catch (caughtError) {
      setSessionError(caughtError instanceof Error ? caughtError.message : 'Unable to update session status')
    }
  }

  const handleDeleteSession = async (session: ChatSession) => {
    if (!window.confirm(`Delete session "${session.title}" and its local messages?`)) return
    try {
      setSessionError(null)
      await deleteChatSession(projectId, session.id)
      await refreshSessions()
    } catch (caughtError) {
      setSessionError(caughtError instanceof Error ? caughtError.message : 'Unable to delete session')
    }
  }

  const handleExportSession = async (session: ChatSession) => {
    try {
      setSessionError(null)
      const exported = await exportChatSession(projectId, session.id)
      const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${session.title.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-|-$/g, '') || session.id}.json`
      anchor.click()
      URL.revokeObjectURL(url)
    } catch (caughtError) {
      setSessionError(caughtError instanceof Error ? caughtError.message : 'Unable to export session')
    }
  }

  return (
    <div className="page-stack">
      <div className="toolbar">
        <label className="search-box">
          <Search size={17} />
          <input type="search" placeholder="Filter sessions" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
        </label>
        <div className="segmented">
          {['all', 'active', 'archived'].map((option) => (
            <button className={option === statusFilter ? 'active' : ''} type="button" key={option} onClick={() => setStatusFilter(option)}>
              {option}
            </button>
          ))}
        </div>
      </div>
      {sessionError && <div className="data-state error compact">{sessionError}</div>}
      <div className="session-workbench">
        <Card title="OpenCode sessions" action={`${filteredSessions.length} session(s)`}>
          {listLoading ? <div className="data-state compact">Loading sessions...</div> : null}
          {filteredSessions.length > 0 ? (
            <div className="session-list">
              {filteredSessions.map((session) => (
                <article className="session-row" key={session.id}>
                  <button className="session-row-main" type="button" onClick={() => onOpenChatSession(session.id)}>
                    <Clock size={18} />
                    <div>
                      <strong>{session.title}</strong>
                      <span>{session.openCodeSessionId ?? session.id}</span>
                      <small>{session.lastMessagePreview || `${session.messageCount ?? 0} stored message(s)`}</small>
                    </div>
                  </button>
                  <div className="session-meta">
                    <StatusBadge tone={sessionStatusTone(session.status)} label={session.status} />
                    <span>{formatSessionTime(session.lastMessageAt ?? session.updatedAt)}</span>
                  </div>
                  <div className="session-actions">
                    <button type="button" aria-label="Open in chatbot" onClick={() => onOpenChatSession(session.id)}>
                      <MessageSquare size={15} />
                    </button>
                    <button type="button" aria-label="Rename session" onClick={() => void handleRenameSession(session)}>
                      <Edit3 size={15} />
                    </button>
                    <button type="button" aria-label={session.status === 'archived' ? 'Reactivate session' : 'Archive session'} onClick={() => void handleArchiveSession(session)}>
                      <Archive size={15} />
                    </button>
                    <button type="button" aria-label="Export session" onClick={() => void handleExportSession(session)}>
                      <Download size={15} />
                    </button>
                    <button className="danger-action" type="button" aria-label="Delete session" onClick={() => void handleDeleteSession(session)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No sessions found" detail="Send a first message in Chatbot to create session history." />
          )}
        </Card>
      </div>
    </div>
  )
}
function sessionStatusTone(status: string): StatusTone {
  if (status === 'active') return 'success'
  if (status === 'archived') return 'neutral'
  if (status === 'failed') return 'danger'
  return 'info'
}
function formatSessionTime(value?: string) {
  if (!value) return 'no activity'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}
