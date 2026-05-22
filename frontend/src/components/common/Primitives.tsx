import type * as React from 'react'
import { AlertTriangle, Circle, Search } from 'lucide-react'
import type { AuditItem, Risk, StatusTone } from '../../types/appData'

export function DiffViewer({ diff }: { diff: string }) {
  return (
    <pre className="diff-viewer">
      {diff.split('\n').map((line, index) => {
        const className = line.startsWith('+') && !line.startsWith('+++')
          ? 'add'
          : line.startsWith('-') && !line.startsWith('---')
            ? 'remove'
            : undefined
        return <code className={className} key={`${index}-${line}`}>{line || ' '}</code>
      })}
    </pre>
  )
}
export function Card({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <article className="surface-card">
      <div className="surface-card-header">
        <h2>{title}</h2>
        {action && <button type="button">{action}</button>}
      </div>
      {children}
    </article>
  )
}
export function QueueItem({ title, risk, detail }: { title: string; risk: Risk; detail: string }) {
  return (
    <article className="queue-item">
      <AlertTriangle size={18} />
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
      <RiskBadge risk={risk} />
    </article>
  )
}
export function AuditTimeline({ items, compact = false }: { items: AuditItem[]; compact?: boolean }) {
  if (items.length === 0) {
    return <EmptyState title="No audit data" detail="Git status and git log did not return any items." />
  }

  return (
    <div className={`audit-timeline ${compact ? 'compact' : ''}`}>
      {items.map((item) => (
        <article className="audit-row" key={`${item.action}-${item.target}-${item.time}`}>
          <div className="audit-marker" />
          <div>
            <strong>{item.action}</strong>
            <span>{item.target}</span>
          </div>
          <RiskBadge risk={item.risk} />
          <StatusBadge tone={statusToneFromLabel(item.status)} label={item.status} />
          <time>{item.time}</time>
        </article>
      ))}
    </div>
  )
}
export function SearchBox({ placeholder }: { placeholder: string }) {
  return (
    <label className="search-box">
      <Search size={17} />
      <input type="search" placeholder={placeholder} />
    </label>
  )
}
export function Segmented({ options, active, dense = false }: { options: string[]; active: string; dense?: boolean }) {
  return (
    <div className={`segmented ${dense ? 'dense' : ''}`}>
      {options.map((option) => (
        <button className={option === active ? 'active' : ''} type="button" key={option}>
          {option}
        </button>
      ))}
    </div>
  )
}
export function RiskBadge({ risk }: { risk: Risk }) {
  return (
    <span className={`risk-badge ${risk}`}>
      {risk === 'critical' ? <AlertTriangle size={13} /> : <Circle size={8} fill="currentColor" />}
      {risk}
    </span>
  )
}
export function StatusBadge({ tone, label }: { tone: StatusTone; label: string }) {
  return <span className={`status-badge ${tone}`}>{label}</span>
}
export function statusToneFromLabel(label: string): StatusTone {
  if (label.includes('fail') || label.includes('delete')) return 'danger'
  if (label.includes('commit') || label.includes('clear')) return 'success'
  if (label.includes('untracked') || label.includes('modified') || label.includes('review')) return 'warning'
  return 'info'
}
export function DataState({
  loading,
  error,
  onRetry,
  compact = false,
}: {
  loading: boolean
  error: string | null
  onRetry: () => void
  compact?: boolean
}) {
  if (loading) {
    return <div className={`data-state ${compact ? 'compact' : ''}`}>Loading live workspace data...</div>
  }
  if (error) {
    return (
      <div className={`data-state error ${compact ? 'compact' : ''}`}>
        <span>{error}</span>
        <button type="button" onClick={onRetry}>Retry</button>
      </div>
    )
  }
  return null
}
export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <span>{detail}</span>
    </div>
  )
}
