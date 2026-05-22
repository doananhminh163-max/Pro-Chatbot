import { AlertTriangle } from 'lucide-react'
import { pageTitles, type NavId } from '../../navigation'
import type { AppState, ConfigChange } from '../../types/appData'
import { DiffViewer, RiskBadge, StatusBadge } from '../common/Primitives'

export function DetailPanel({
  activePage,
  data,
  pendingChange,
  onApplyPendingChange,
}: {
  activePage: NavId
  data: AppState
  pendingChange: ConfigChange | null
  onApplyPendingChange: () => Promise<void>
}) {
  const selectedRisk = data.dashboard.riskQueue[0]
  const drawerRisk = pendingChange?.riskLevel ?? selectedRisk?.risk
  return (
    <aside className="detail-drawer" aria-label="Details">
      <div className="drawer-header">
        <span>Detail panel</span>
        <h2>{pendingChange ? 'Change proposal' : `${pageTitles[activePage].title} review`}</h2>
      </div>
      <div className="drawer-section">
        <div className="drawer-row">
          <span>Status</span>
          <StatusBadge tone={pendingChange || selectedRisk ? 'warning' : 'success'} label={pendingChange?.status ?? (selectedRisk ? 'review' : 'clear')} />
        </div>
        <div className="drawer-row">
          <span>Risk</span>
          {drawerRisk ? <RiskBadge risk={drawerRisk} /> : <span>none</span>}
        </div>
        <div className="drawer-row">
          <span>Source</span>
          <strong>{pendingChange?.targetFile ?? data.project.name}</strong>
        </div>
      </div>
      {pendingChange?.warnings.length ? (
        <div className="drawer-section">
          <h3>Warnings</h3>
          {pendingChange.warnings.map((warning) => (
            <div className="warning-row" key={`${warning.code}-${warning.message}`}>
              <AlertTriangle size={15} />
              <span>{warning.message}</span>
            </div>
          ))}
        </div>
      ) : null}
      <div className="drawer-section">
        <h3>{pendingChange ? 'Diff preview' : 'Live source preview'}</h3>
        {pendingChange ? <DiffViewer diff={pendingChange.diff} /> : <pre className="code-block">{detailPreview(activePage, data)}</pre>}
      </div>
      <div className="drawer-actions">
        <button type="button">Save draft</button>
        <button type="button" className="danger-action" disabled={!pendingChange} onClick={onApplyPendingChange}>
          Confirm apply
        </button>
      </div>
    </aside>
  )
}
function detailPreview(activePage: NavId, data: AppState) {
  if (activePage === 'commands') return data.commands[0]?.preview ?? 'No command source available.'
  return JSON.stringify({
    project: data.project.name,
    riskQueue: data.dashboard.riskQueue.slice(0, 5),
    generatedAt: data.generatedAt,
  }, null, 2)
}
