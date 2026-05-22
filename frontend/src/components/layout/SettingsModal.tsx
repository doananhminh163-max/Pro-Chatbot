import { X } from 'lucide-react'
import { EmptyState } from '../common/Primitives'
import { ConfigSettingsPage } from '../../pages/ConfigSettingsPage'
import type { AppState } from '../../types/appData'

export function SettingsModal({
  data,
  onClose,
  onRequestChange,
}: {
  data: AppState | null
  onClose: () => void
  onRequestChange: (title: string, patch: Record<string, unknown>) => void
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <header className="settings-modal-header">
          <div>
            <span>OpenCode config</span>
            <h2 id="settings-title">Setting</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close setting" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <div className="settings-modal-body">
          {data ? (
            <ConfigSettingsPage data={data} onRequestChange={onRequestChange} />
          ) : (
            <EmptyState title="No config loaded" detail="Workspace data is still loading." />
          )}
        </div>
      </section>
    </div>
  )
}
