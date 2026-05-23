import { useCallback, useMemo, useState } from 'react'
import {
  applyConfigChange,
  backupWorkingTreeChanges,
  clearSnapshotReviewChanges,
  createAgent,
  createCommand,
  createMcpServer,
  importSkill,
  installMarketplaceSkill,
  previewConfigPatch,
  previewPermissionUpdate,
  reviewWorkingTreeChanges,
} from '../services/appDataService'
import type { ConfigChange, WorkingTreeBackupResult, WorkingTreeReview } from '../types/appData'
import { createWorkspaceActionHandlers, type WorkspaceActionApi } from './workspaceActionHandlers'

const defaultWorkspaceActionApi: WorkspaceActionApi = {
  createAgent,
  createCommand,
  createMcpServer,
  importSkill,
  installMarketplaceSkill,
  previewConfigPatch,
  previewPermissionUpdate,
}

export function useWorkspaceActions({
  closeSettings,
  openDrawer,
  projectId,
  refresh,
}: {
  closeSettings: () => void
  openDrawer: () => void
  projectId: string | undefined
  refresh: () => Promise<void>
}) {
  const [pendingChange, setPendingChange] = useState<ConfigChange | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [changeReviewOpen, setChangeReviewOpen] = useState(false)
  const [changeReview, setChangeReview] = useState<WorkingTreeReview | null>(null)
  const [changeReviewLoading, setChangeReviewLoading] = useState(false)
  const [changeReviewError, setChangeReviewError] = useState<string | null>(null)
  const [changeBackupResult, setChangeBackupResult] = useState<WorkingTreeBackupResult | null>(null)

  const loadChangeReview = useCallback(async () => {
    if (!projectId) {
      setChangeReviewError('Workspace data is not loaded yet.')
      return
    }
    setChangeReviewLoading(true)
    setChangeReviewError(null)
    try {
      setChangeReview(await reviewWorkingTreeChanges(projectId))
    } catch (caughtError) {
      setChangeReviewError(caughtError instanceof Error ? caughtError.message : 'Unable to review snapshot changes')
    } finally {
      setChangeReviewLoading(false)
    }
  }, [projectId])

  const handleOpenChangeReview = useCallback(() => {
    setChangeReviewOpen(true)
    setChangeBackupResult(null)
    void loadChangeReview()
  }, [loadChangeReview])

  const handleBackupReviewedChanges = useCallback(async (snapshotIds: string[]) => {
    if (!projectId) {
      setChangeReviewError('Workspace data is not loaded yet.')
      return
    }
    setChangeReviewError(null)
    try {
      const result = await backupWorkingTreeChanges(projectId, snapshotIds, { restore: true })
      setChangeBackupResult(result)
      if (result.restore?.failed.length) {
        setChangeReviewError(`Backup created, but ${result.restore.failed.length} snapshot restore(s) failed.`)
        await refresh()
        await loadChangeReview()
        return
      }
      await clearSnapshotReviewChanges(projectId, snapshotIds)
      await refresh()
      await loadChangeReview()
    } catch (caughtError) {
      setChangeReviewError(caughtError instanceof Error ? caughtError.message : 'Unable to backup snapshot changes')
    }
  }, [loadChangeReview, projectId, refresh])

  const handleClearSnapshotChanges = useCallback(async (snapshotIds: string[]) => {
    if (!projectId) {
      setChangeReviewError('Workspace data is not loaded yet.')
      return
    }
    setChangeReviewError(null)
    try {
      await clearSnapshotReviewChanges(projectId, snapshotIds)
      setChangeBackupResult(null)
      await refresh()
      await loadChangeReview()
    } catch (caughtError) {
      setChangeReviewError(caughtError instanceof Error ? caughtError.message : 'Unable to clear snapshot changes')
    }
  }, [loadChangeReview, projectId, refresh])

  const runAction = useCallback(async (action: () => Promise<ConfigChange | void>) => {
    if (!projectId) {
      setActionError('Workspace data is not loaded yet.')
      return
    }
    setActionError(null)
    try {
      const change = await action()
      if (change) {
        setPendingChange(change)
        openDrawer()
      }
      await refresh()
    } catch (caughtError) {
      setActionError(caughtError instanceof Error ? caughtError.message : 'Action failed')
    }
  }, [openDrawer, projectId, refresh])

  const actions = useMemo(() => createWorkspaceActionHandlers({
    api: defaultWorkspaceActionApi,
    projectId,
    prompt: window.prompt.bind(window),
    runAction,
    setActionError,
  }), [projectId, runAction])

  const handleApplyPendingChange = useCallback(async () => {
    if (!pendingChange) return
    setActionError(null)
    try {
      await applyConfigChange(pendingChange.id)
      setPendingChange(null)
      await refresh()
    } catch (caughtError) {
      setActionError(caughtError instanceof Error ? caughtError.message : 'Apply failed')
    }
  }, [pendingChange, refresh])

  const handleSettingChange = useCallback(async (title: string, patch: Record<string, unknown>) => {
    if (!projectId) {
      setActionError('Workspace data is not loaded yet.')
      return
    }

    setActionError(null)
    try {
      const change = await previewConfigPatch(projectId, patch)
      setPendingChange(change)
      openDrawer()
      closeSettings()
      await refresh()
    } catch (caughtError) {
      setActionError(caughtError instanceof Error ? caughtError.message : `Unable to update ${title}`)
    }
  }, [closeSettings, openDrawer, projectId, refresh])

  const previewChange = useCallback((change: ConfigChange) => {
    setPendingChange(change)
    openDrawer()
  }, [openDrawer])

  return {
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
  }
}
