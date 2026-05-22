import { GitPullRequest, History, RefreshCw, Settings } from 'lucide-react'

export function MainHeader({
  meta,
  drawerOpen,
  detailPanelAvailable,
  detailPanelLabel,
  loading,
  onRefresh,
  onToggleDrawer,
  onOpenSettings,
  onReviewChanges,
}: {
  meta: { title: string; eyebrow: string; description: string }
  drawerOpen: boolean
  detailPanelAvailable: boolean
  detailPanelLabel: string
  loading: boolean
  onRefresh: () => void
  onToggleDrawer: () => void
  onOpenSettings: () => void
  onReviewChanges?: () => void
}) {
  return (
    <header className="main-header">
      <div className="header-copy">
        <span>{meta.eyebrow}</span>
        <h1>{meta.title}</h1>
        <p>{meta.description}</p>
      </div>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="Refresh" onClick={onRefresh}>
          <RefreshCw size={18} className={loading ? 'spin' : undefined} />
        </button>
        {detailPanelAvailable && (
          <button className={`toolbar-button ${drawerOpen ? 'active' : ''}`} type="button" onClick={onToggleDrawer}>
            <GitPullRequest size={17} />
            <span>{detailPanelLabel}</span>
          </button>
        )}
        {onReviewChanges && (
          <button className="toolbar-button" type="button" onClick={onReviewChanges}>
            <History size={17} />
            <span>Review changes</span>
          </button>
        )}
        <button className="toolbar-button" type="button" aria-label="Setting" onClick={onOpenSettings}>
          <Settings size={17} />
          <span>Setting</span>
        </button>
      </div>
    </header>
  )
}
