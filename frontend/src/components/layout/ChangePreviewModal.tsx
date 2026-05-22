import { AlertTriangle, X } from 'lucide-react'
import type { ConfigChange } from '../../types/appData'
import { DiffViewer } from '../common/Primitives'

export function ChangePreviewModal({
  change,
  onClose,
  onApply,
}: {
  change: ConfigChange
  onClose: () => void
  onApply: () => Promise<void>
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="change-preview-modal" role="dialog" aria-modal="true" aria-labelledby="change-preview-title">
        <header className="change-preview-header">
          <div>
            <span>Preview change</span>
            <h2 id="change-preview-title">Change proposal</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close preview change" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <div className="change-preview-body">
          <div className="drawer-section">
            <div className="drawer-row">
              <span>Source</span>
              <strong>{change.targetFile}</strong>
            </div>
          </div>

          {change.warnings.length ? (
            <div className="drawer-section">
              <h3>Warnings</h3>
              {change.warnings.map((warning) => (
                <div className="warning-row" key={`${warning.code}-${warning.message}`}>
                  <AlertTriangle size={15} />
                  <span>{warning.message}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="drawer-section">
            <h3>Diff preview</h3>
            <DiffViewer diff={change.diff} />
          </div>
        </div>

        <footer className="change-preview-actions">
          <button type="button" onClick={onClose}>Close</button>
          <button type="button" className="danger-action" onClick={onApply}>
            Confirm apply
          </button>
        </footer>
      </section>
    </div>
  )
}
