import { type NavId } from '../navigation'
import type { AppState, ConfigChange } from '../types/appData'
import type { ActionHandlers } from '../types/actionHandlers'
import { DataState } from '../components/common/Primitives'
import { DetailPanel } from '../components/layout/DetailPanel'
import { AgentsPage } from './AgentsPage'
import { CommandsPage } from './CommandsPage'
import { McpPage } from './McpPage'
import { PermissionsPage } from './PermissionsPage'
import { SkillsPage } from './SkillsPage'

export function WorkspacePage({
  activePage,
  drawerOpen,
  detailPanelAvailable,
  data,
  loading,
  error,
  onRetry,
  actions,
  pendingChange,
  onApplyPendingChange,
  onPreviewChange,
}: {
  activePage: NavId
  drawerOpen: boolean
  detailPanelAvailable: boolean
  data: AppState | null
  loading: boolean
  error: string | null
  onRetry: () => void
  actions: ActionHandlers
  pendingChange: ConfigChange | null
  onApplyPendingChange: () => Promise<void>
  onPreviewChange: (change: ConfigChange) => void
}) {
  const showDetailPanel = drawerOpen && detailPanelAvailable && !pendingChange

  return (
    <section className={`workspace-grid ${showDetailPanel ? 'with-drawer' : ''}`}>
      <DataState loading={loading} error={error} onRetry={onRetry} />
      <div className="workspace-primary">{data && renderWorkspaceContent(activePage, data, actions, onRetry, onPreviewChange)}</div>
      {showDetailPanel && data && <DetailPanel activePage={activePage} data={data} pendingChange={pendingChange} onApplyPendingChange={onApplyPendingChange} />}
    </section>
  )
}
function renderWorkspaceContent(activePage: NavId, data: AppState, actions: ActionHandlers, onRefresh: () => void, onPreviewChange: (change: ConfigChange) => void) {
  switch (activePage) {
    case 'agents':
      return <AgentsPage data={data} actions={actions} onRefresh={onRefresh} onPreviewChange={onPreviewChange} />
    case 'permissions':
      return <PermissionsPage data={data} actions={actions} />
    case 'skills':
      return <SkillsPage data={data} onRefresh={onRefresh} />
    case 'mcp':
      return <McpPage data={data} actions={actions} onRefresh={onRefresh} />
    case 'commands':
      return <CommandsPage data={data} actions={actions} onRefresh={onRefresh} />
  }
}
