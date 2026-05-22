import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import {
  applyConfigChange,
  backupWorkingTreeChanges,
  clearSnapshotReviewChanges,
  createAgent,
  createChatSession,
  createCommand,
  createMcpServer,
  getConfigChange,
  importSkill,
  installMarketplaceSkill,
  previewConfigPatch,
  previewPermissionUpdate,
  reviewWorkingTreeChanges,
  respondChatPermission,
  searchChatReferences,
  sendChatMessage,
  streamChatMessage as streamChatMessageApi,
} from './services/appDataService'
import { Sidebar } from './components/layout/Sidebar'
import { MainHeader } from './components/layout/MainHeader'
import { SettingsModal } from './components/layout/SettingsModal'
import { ChangePreviewModal } from './components/layout/ChangePreviewModal'
import { ChangeReviewModal } from './components/layout/ChangeReviewModal'
import { ChatPage } from './features/chat/ChatPage'
import { WorkspacePage } from './pages/WorkspacePage'
import { useAppData } from './hooks/useAppData'
import {
  chatNewPath,
  chatSessionIdFromPathname,
  chatSessionPath,
  isKnownPagePath,
  isNewChatPath,
  navIdFromPathname,
  pagePath,
  pageTitles,
  pageUsesDetailPanel,
  type NavId,
} from './navigation'
import type { ChatStreamEvent, ChatSubmitOptions, ConfigChange, MarketplaceItem, PermissionResponse, WorkingTreeBackupResult, WorkingTreeReview } from './types/appData'
import type { ActionHandlers } from './types/actionHandlers'

export function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [pendingChange, setPendingChange] = useState<ConfigChange | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [changeReviewOpen, setChangeReviewOpen] = useState(false)
  const [changeReview, setChangeReview] = useState<WorkingTreeReview | null>(null)
  const [changeReviewLoading, setChangeReviewLoading] = useState(false)
  const [changeReviewError, setChangeReviewError] = useState<string | null>(null)
  const [changeBackupResult, setChangeBackupResult] = useState<WorkingTreeBackupResult | null>(null)
  const { data, loading, error, refresh } = useAppData()

  const activePage = navIdFromPathname(location.pathname)
  const activeChatSessionId = chatSessionIdFromPathname(location.pathname)
  const startFreshChat = isNewChatPath(location.pathname)
  const headerMeta = pageTitles[activePage]
  const projectId = data?.project.id
  const detailPanelAvailable = pageUsesDetailPanel(activePage, pendingChange)

  useEffect(() => {
    if (location.pathname === '/') {
      navigate(pagePath('chat'), { replace: true })
      return
    }
    if (!isKnownPagePath(location.pathname)) {
      navigate(pagePath('chat'), { replace: true })
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

  const handleStartNewChat = () => {
    navigate(chatNewPath())
    setMobileNavOpen(false)
  }

  const handleOpenChatSession = (sessionId: string) => {
    navigate(chatSessionPath(sessionId))
    setMobileNavOpen(false)
  }

  const handleActiveChatSessionChange = useCallback((sessionId: string | null) => {
    navigate(sessionId ? chatSessionPath(sessionId) : chatNewPath())
  }, [navigate])

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
        setDrawerOpen(true)
      }
      await refresh()
    } catch (caughtError) {
      setActionError(caughtError instanceof Error ? caughtError.message : 'Action failed')
    }
  }, [projectId, refresh])

  const actions: ActionHandlers = useMemo(() => ({
    submitChatMessage: async (sessionId: string | null, message: string, options: ChatSubmitOptions = {}) => {
      if (!projectId) {
        throw new Error('Workspace data is not loaded yet.')
      }
      setActionError(null)
      const activeSessionId = sessionId ?? (await createChatSession(projectId, {
        title: message.slice(0, 64) || 'OpenCode chat',
        agent: options.agent,
        model: options.model,
        skills: options.skills,
      })).id
      const response = await sendChatMessage(projectId, activeSessionId, message, options)
      if (response.backupError) {
        setActionError(`Chat completed, but backup failed: ${response.backupError.message}`)
      }
      if (response.configChangeId) {
        void getConfigChange(response.configChangeId).then((change) => {
          setPendingChange(change)
          setDrawerOpen(true)
        }).catch((caughtError) => {
          setActionError(caughtError instanceof Error ? caughtError.message : 'Unable to load config proposal')
        })
      }
      void refresh().catch((caughtError) => {
        setActionError(caughtError instanceof Error ? caughtError.message : 'Unable to refresh app state')
      })
      return response
    },
    createConfigProposal: async () => {
      await runAction(async () => {
        if (!projectId) return
        const rawPatch = window.prompt('JSON patch for opencode.json', '{ "model": "opencode/gpt-5" }')
        if (!rawPatch) return
        return previewConfigPatch(projectId, JSON.parse(rawPatch) as Record<string, unknown>)
      })
    },
    createAgentProposal: async () => {
      await runAction(async () => {
        if (!projectId) return
        const name = window.prompt('Agent name', 'review')
        if (!name) return
        const description = window.prompt('Agent description', 'Read-only code review agent') ?? 'Read-only code review agent'
        const prompt = window.prompt('Agent prompt', 'Review code without editing files. Report findings clearly.') ?? ''
        return createAgent(projectId, {
          name,
          description,
          mode: 'subagent',
          permission: { read: 'allow', grep: 'allow', glob: 'allow', edit: 'deny', bash: 'deny' },
          prompt,
        })
      })
    },
    updatePermissionProposal: async () => {
      await runAction(async () => {
        if (!projectId) return
        const tool = window.prompt('Tool name', 'bash')
        if (!tool) return
        const value = window.prompt('Permission value: allow, ask, deny', 'ask')
        if (!value) return
        return previewPermissionUpdate(projectId, { [tool]: value })
      })
    },
    importSkillProposal: async () => {
      await runAction(async () => {
        if (!projectId) return
        const directoryName = window.prompt('Skill directory/name', 'project-helper')
        if (!directoryName) return
        const description = window.prompt('Skill description', 'Project-specific workflow helper') ?? 'Project-specific workflow helper'
        const content = `---\nname: ${directoryName}\ndescription: ${description}\n---\n# ${directoryName}\n\nUse this skill for ${description.toLowerCase()}.\n`
        return importSkill(projectId, { directoryName, content })
      })
    },
    installMarketplaceProposal: async (item: MarketplaceItem) => {
      await runAction(async () => {
        if (!projectId || !item.id) {
          setActionError('Marketplace item id is not available.')
          return
        }
        return installMarketplaceSkill(projectId, item.id, item.name)
      })
    },
    createMcpProposal: async () => {
      await runAction(async () => {
        if (!projectId) return
        const name = window.prompt('MCP server name', 'context7')
        if (!name) return
        const url = window.prompt('Remote MCP URL', 'https://example.com/mcp')
        return createMcpServer(projectId, { name, type: url ? 'remote' : 'local', url, enabled: false })
      })
    },
    createCommandProposal: async () => {
      await runAction(async () => {
        if (!projectId) return
        const name = window.prompt('Command name', 'test')
        if (!name) return
        const template = window.prompt('Command template', 'Run the full test suite and summarize failures.')
        if (!template) return
        await createCommand(projectId, { name, description: `${name} command`, template })
      })
    },
  }), [projectId, refresh, runAction])

  const handleStreamChatMessage = useCallback(async (
    sessionId: string | null,
    message: string,
    options: ChatSubmitOptions = {},
    onEvent?: (event: ChatStreamEvent) => void,
    signal?: AbortSignal,
  ) => {
    if (!projectId) {
      throw new Error('Workspace data is not loaded yet.')
    }
    setActionError(null)
    const activeSessionId = sessionId ?? (await createChatSession(projectId, {
      title: message.slice(0, 64) || 'OpenCode chat',
      agent: options.agent,
      model: options.model,
      skills: options.skills,
    })).id
    if (!sessionId) {
      navigate(chatSessionPath(activeSessionId), { replace: true })
    }
    const response = await streamChatMessageApi(projectId, activeSessionId, message, options, onEvent, signal)
    if (response.backupError) {
      setActionError(`Chat completed, but backup failed: ${response.backupError.message}`)
    }
    if (response.configChangeId) {
      void getConfigChange(response.configChangeId).then((change) => {
        setPendingChange(change)
        setDrawerOpen(true)
      }).catch((caughtError) => {
        setActionError(caughtError instanceof Error ? caughtError.message : 'Unable to load config proposal')
      })
    }
    void refresh().catch((caughtError) => {
      setActionError(caughtError instanceof Error ? caughtError.message : 'Unable to refresh app state')
    })
    return response
  }, [navigate, projectId, refresh])

  const handleRespondChatPermission = useCallback(async (sessionId: string, permissionId: string, response: PermissionResponse) => {
    if (!projectId) {
      throw new Error('Workspace data is not loaded yet.')
    }
    await respondChatPermission(projectId, sessionId, permissionId, response)
  }, [projectId])

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
      setDrawerOpen(true)
      setSettingsOpen(false)
      await refresh()
    } catch (caughtError) {
      setActionError(caughtError instanceof Error ? caughtError.message : `Unable to update ${title}`)
    }
  }, [projectId, refresh])

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
        onNewChat={handleStartNewChat}
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
          {activePage === 'chat' ? (
            <ChatPage
              projectId={projectId}
              activeSessionId={activeChatSessionId}
              startFresh={startFreshChat}
              loading={loading}
              error={error}
              onRetry={refresh}
              onActiveSessionChange={handleActiveChatSessionChange}
              onSubmitMessage={actions.submitChatMessage}
              onStreamMessage={handleStreamChatMessage}
              onRespondPermission={handleRespondChatPermission}
              onSearchReferences={(query) => projectId ? searchChatReferences(projectId, query) : Promise.resolve([])}
              models={data?.models ?? []}
              agents={data?.agents ?? []}
              commands={data?.commands ?? []}
              skills={data?.skills ?? []}
            />
          ) : (
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
              onPreviewChange={(change) => {
                setPendingChange(change)
                setDrawerOpen(true)
              }}
              onOpenChatSession={handleOpenChatSession}
            />
          )}
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
