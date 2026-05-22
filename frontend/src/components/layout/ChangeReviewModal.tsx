import { Check, CheckSquare, RefreshCw, Shield, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { WorkingTreeBackupResult, WorkingTreeChangeFile, WorkingTreeReview } from '../../types/appData'
import { DiffViewer, EmptyState } from '../common/Primitives'

function fileKey(file: WorkingTreeChangeFile) {
  return file.id ?? file.path
}

export function ChangeReviewModal({
  review,
  backupResult,
  loading,
  error,
  onClose,
  onRefresh,
  onClear,
  onBackup,
}: {
  review: WorkingTreeReview | null
  backupResult: WorkingTreeBackupResult | null
  loading: boolean
  error: string | null
  onClose: () => void
  onRefresh: () => void
  onClear: (snapshotIds: string[]) => Promise<void>
  onBackup: (snapshotIds: string[]) => Promise<void>
}) {
  const files = useMemo(() => review?.files ?? [], [review])
  const filesKey = useMemo(() => files.map(fileKey).join('\0'), [files])
  const [selection, setSelection] = useState<{ filesKey: string; ids: Set<string> }>({ filesKey: '', ids: new Set() })
  const [requestedActiveId, setRequestedActiveId] = useState<string | null>(null)
  const [backingUp, setBackingUp] = useState(false)
  const [clearing, setClearing] = useState(false)
  const selectedIds = selection.filesKey === filesKey ? selection.ids : new Set<string>()
  const activeId = requestedActiveId && files.some((file) => fileKey(file) === requestedActiveId)
    ? requestedActiveId
    : files[0] ? fileKey(files[0]) : null
  const activeFile = useMemo(() => files.find((file) => fileKey(file) === activeId) ?? files[0] ?? null, [activeId, files])
  const selectedCount = selectedIds.size
  const allSelected = files.length > 0 && selectedCount === files.length

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelection({ filesKey, ids: new Set() })
    } else {
      setSelection({ filesKey, ids: new Set(files.map(fileKey)) })
    }
  }

  const togglePath = (file: WorkingTreeChangeFile) => {
    const key = fileKey(file)
    setSelection((current) => {
      const currentIds = current.filesKey === filesKey ? current.ids : new Set<string>()
      const next = new Set(currentIds)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return { filesKey, ids: next }
    })
    setRequestedActiveId(key)
  }

  const handleBackup = async () => {
    setBackingUp(true)
    try {
      await onBackup([...selectedIds])
    } finally {
      setBackingUp(false)
    }
  }

  const handleClear = async () => {
    setClearing(true)
    try {
      await onClear([...selectedIds])
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="change-review-modal" role="dialog" aria-modal="true" aria-labelledby="change-review-title">
        <header className="change-preview-header">
          <div>
            <span>Review changes</span>
            <h2 id="change-review-title">OpenCode snapshot backup</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close review changes" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <div className="change-review-toolbar">
          <div>
            <strong>{review ? `${review.summary.total} snapshot change(s)` : 'Checking snapshots'}</strong>
            <span>{review ? `Modified ${review.summary.modified} | Added ${review.summary.added ?? 0} | Deleted ${review.summary.deleted}` : 'Reading OpenCode snapshots'}</span>
          </div>
          <div className="change-review-toolbar-actions">
            <button type="button" onClick={handleToggleSelectAll} disabled={loading || files.length === 0}>
              <CheckSquare size={15} />
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
            <button type="button" onClick={handleClear} disabled={loading || clearing || selectedCount === 0}>
              <Trash2 size={15} />
              Delete snapshots ({selectedCount})
            </button>
            <button type="button" onClick={onRefresh} disabled={loading}>
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        </div>

        <div className="change-review-body">
          <aside className="change-review-list" aria-label="Snapshot changes">
            {loading && <div className="data-state compact">Loading snapshot changes...</div>}
            {error && <div className="data-state error compact"><span>{error}</span></div>}
            {!loading && !error && files.length === 0 && <EmptyState title="No snapshot changes" detail="OpenCode did not return snapshot diffs for recent chat messages." />}
            {files.map((file) => (
              <button
                key={fileKey(file)}
                type="button"
                className={activeFile && fileKey(activeFile) === fileKey(file) ? 'active' : ''}
                onClick={() => togglePath(file)}
              >
                <span className="review-check" aria-hidden="true">{selectedIds.has(fileKey(file)) ? <Check size={13} /> : null}</span>
                <span>
                  <strong>{file.path}</strong>
                  <small>{file.sessionTitle ? `${file.statusCode} | ${file.sessionTitle}` : file.statusCode}</small>
                </span>
              </button>
            ))}
          </aside>

          <div className="change-review-diff">
            {activeFile ? (
              <>
                <div className="drawer-section">
                  <div className="drawer-row">
                    <span>Source</span>
                    <strong>{activeFile.path}</strong>
                  </div>
                  {activeFile.sessionId && (
                    <div className="drawer-row">
                      <span>Snapshot</span>
                      <strong>{activeFile.sessionId}/{activeFile.messageId}</strong>
                    </div>
                  )}
                  <div className="drawer-row">
                    <span>Changes</span>
                    <strong>+{activeFile.additions ?? 0} / -{activeFile.deletions ?? 0}</strong>
                  </div>
                </div>
                {activeFile.warnings.length > 0 && (
                  <div className="drawer-section">
                    <h3>Warnings</h3>
                    {activeFile.warnings.map((warning) => (
                      <div className="warning-row" key={`${warning.code}-${warning.message}`}>
                        <Shield size={15} />
                        <span>{warning.message}</span>
                      </div>
                    ))}
                  </div>
                )}
                <DiffViewer diff={activeFile.diff} />
              </>
            ) : (
              <EmptyState title="No snapshot selected" detail="Select a snapshot change to inspect its diff." />
            )}
          </div>
        </div>

        {backupResult && (
          <div className="change-review-result">
            <strong>Backup created</strong>
            <span>{backupResult.backups.length} snapshot file(s) saved under {backupResult.backupRoot}</span>
          </div>
        )}

        <footer className="change-preview-actions">
          <button type="button" onClick={onClose}>Close</button>
          <button type="button" className="danger-action" disabled={selectedCount === 0 || backingUp} onClick={handleBackup}>
            Backup selected ({selectedCount})
          </button>
        </footer>
      </section>
    </div>
  )
}
