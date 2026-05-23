import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './components/layout/Sidebar'
import { MainHeader } from './components/layout/MainHeader'
import { SettingsModal } from './components/layout/SettingsModal'
import { ChangePreviewModal } from './components/layout/ChangePreviewModal'
import { ChangeReviewModal } from './components/layout/ChangeReviewModal'
import { WorkspacePage } from './pages/WorkspacePage'
import { useAppData } from './hooks/useAppData'
import { useWorkspaceActions } from './hooks/useWorkspaceActions'
import {
  isKnownPagePath,
  navIdFromPathname,
  pagePath,
  pageTitles,
  pageUsesDetailPanel,
  type NavId,
} from './navigation'

export function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { data, loading, error, refresh } = useAppData()

  const activePage = navIdFromPathname(location.pathname)
  const headerMeta = pageTitles[activePage]
  const projectId = data?.project.id
  const {
    actionError,
    actions,
    changeBackupResult,
    changeReview,
    changeReviewError,
    changeReviewLoading,
    changeReviewOpen,
    handleApplyPendingChange,
    handleBackupReviewedChanges,
    handleClearSnapshotChanges,
    handleOpenChangeReview,
    handleSettingChange,
    loadChangeReview,
    pendingChange,
    previewChange,
    setChangeReviewOpen,
  } = useWorkspaceActions({
    closeSettings: () => setSettingsOpen(false),
    openDrawer: () => setDrawerOpen(true),
    projectId,
    refresh,
  })
  const detailPanelAvailable = pageUsesDetailPanel(activePage, pendingChange)

  useEffect(() => {
    if (location.pathname === '/') {
      navigate(pagePath('agents'), { replace: true })
      return
    }
    if (!isKnownPagePath(location.pathname)) {
      navigate(pagePath('agents'), { replace: true })
    }
  }, [location.pathname, navigate])

  const shellClassName = useMemo(() => {
    const classes = ['app-shell']
    if (sidebarCollapsed) classes.push('is-collapsed')
    if (mobileNavOpen) classes.push('is-mobile-nav-open')
    return classes.join(' ')
  }, [mobileNavOpen, sidebarCollapsed])

  const handleNavigate = (id: NavId) => {
    navigate(pagePath(id))
    setMobileNavOpen(false)
  }

  return (
    <div className={shellClassName}>
      <button
        className="mobile-nav-trigger"
        type="button"
        aria-label="Open navigation"
        onClick={() => setMobileNavOpen((value) => !value)}
      >
        {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <Sidebar
        activePage={activePage}
        collapsed={sidebarCollapsed}
        data={data}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
        onNavigate={handleNavigate}
      />

      <main className="main-workspace">
        <MainHeader
          meta={headerMeta}
          drawerOpen={drawerOpen}
          detailPanelAvailable={detailPanelAvailable}
          detailPanelLabel={pendingChange ? 'Preview change' : 'Diff panel'}
          loading={loading}
          onRefresh={refresh}
          onToggleDrawer={() => setDrawerOpen((value) => !value)}
          onOpenSettings={() => setSettingsOpen(true)}
          onReviewChanges={handleOpenChangeReview}
        />

        <div className="workspace-scroll">
          {actionError && <div className="global-error">{actionError}</div>}
          <WorkspacePage
            activePage={activePage}
            drawerOpen={drawerOpen}
            detailPanelAvailable={detailPanelAvailable}
            data={data}
            loading={loading}
            error={error}
            onRetry={refresh}
            actions={actions}
            pendingChange={pendingChange}
            onApplyPendingChange={handleApplyPendingChange}
            onPreviewChange={previewChange}
          />
        </div>
      </main>

      {settingsOpen && <SettingsModal data={data} onClose={() => setSettingsOpen(false)} onRequestChange={handleSettingChange} />}
      {drawerOpen && pendingChange && (
        <ChangePreviewModal
          change={pendingChange}
          onApply={handleApplyPendingChange}
          onClose={() => setDrawerOpen(false)}
        />
      )}
      {changeReviewOpen && (
        <ChangeReviewModal
          review={changeReview}
          backupResult={changeBackupResult}
          loading={changeReviewLoading}
          error={changeReviewError}
          onClose={() => setChangeReviewOpen(false)}
          onRefresh={loadChangeReview}
          onClear={handleClearSnapshotChanges}
          onBackup={handleBackupReviewedChanges}
        />
      )}
    </div>
  )
}

export default App
