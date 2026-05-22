import { AlertTriangle } from 'lucide-react'
import type { ConfigChange, RiskQueueItem } from '../../types/appData'
import { RiskBadge } from '../../components/common/Primitives'

export function PendingChangeCard({ change, onApply }: { change: ConfigChange; onApply: () => Promise<void> }) {
  return (
    <article className="proposal-card pending-change-card">
      <div>
        <RiskBadge risk={change.riskLevel} />
        <h3>{change.summary}</h3>
        <p>{change.targetFile ?? change.type} Â· {change.status}</p>
      </div>
      <button className="toolbar-button warning" type="button" onClick={onApply}>
        <AlertTriangle size={17} />
        <span>Confirm apply</span>
      </button>
    </article>
  )
}

export function ProposalCard({ proposal }: { proposal: RiskQueueItem }) {
  return (
    <article className="proposal-card">
      <div>
        <RiskBadge risk={proposal.risk} />
        <h3>{proposal.title}</h3>
        <p>{proposal.detail}</p>
      </div>
      <button className="toolbar-button warning" type="button">
        <AlertTriangle size={17} />
        <span>Review source</span>
      </button>
    </article>
  )
}
