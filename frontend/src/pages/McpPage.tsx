import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { CheckCircle2, KeyRound, PlugZap, RefreshCw, Search, Trash2, X } from 'lucide-react'
import type { AppState, McpMarketplaceItem, McpRuntimeCheck, McpServer } from '../types/appData'
import type { ActionHandlers } from '../types/actionHandlers'
import { checkMcpServers, installMcpServer, listMcpMarketplace, removeMcpServer } from '../services/appDataService'
import { EmptyState, RiskBadge, StatusBadge } from '../components/common/Primitives'

type InstallForm = {
  item: McpMarketplaceItem
  name: string
  url: string
  apiKey: string
  apiKeyEnvVar: string
}

const marketplacePageSize = 15

export function McpPage({
  data,
  onRefresh,
}: {
  data: AppState
  actions: ActionHandlers
  onRefresh: () => void
}) {
  const [marketplace, setMarketplace] = useState<McpMarketplaceItem[]>([])
  const [runtimeCheck, setRuntimeCheck] = useState<McpRuntimeCheck | null>(null)
  const [installForm, setInstallForm] = useState<InstallForm | null>(null)
  const [marketplaceQuery, setMarketplaceQuery] = useState('')
  const [marketplaceLimit, setMarketplaceLimit] = useState(marketplacePageSize)
  const [loadingMarketplace, setLoadingMarketplace] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const configuredServers = useMemo(
    () => data.mcpServers,
    [data.mcpServers],
  )
  const missingRuntimeServers = useMemo(
    () => runtimeCheck
      ? configuredServers.filter((server) => runtimeCheck.status[server.name] === undefined)
      : [],
    [configuredServers, runtimeCheck],
  )
  const installedMarketplaceIds = useMemo(() => {
    const configuredNames = new Set(configuredServers.map((server) => server.name.toLowerCase()))
    const configuredUrls = new Set(
      configuredServers
        .map((server) => server.url?.trim().toLowerCase())
        .filter((url): url is string => !!url),
    )

    return new Set(
      marketplace
        .filter((item) => {
          const installName = item.installName?.toLowerCase()
          return configuredNames.has(item.id.toLowerCase())
            || (installName ? configuredNames.has(installName) : false)
            || (item.url ? configuredUrls.has(item.url.trim().toLowerCase()) : false)
        })
        .map((item) => item.id),
    )
  }, [configuredServers, marketplace])

  useEffect(() => {
    let active = true
    setLoadingMarketplace(true)
    const timeout = window.setTimeout(() => {
      listMcpMarketplace({ q: marketplaceQuery, limit: marketplaceLimit })
      .then((items) => {
        if (active) setMarketplace(items)
      })
      .catch((caughtError) => {
        if (active) setError(caughtError instanceof Error ? caughtError.message : 'Unable to load MCP marketplace')
      })
      .finally(() => {
        if (active) setLoadingMarketplace(false)
      })
    }, 250)
    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [marketplaceQuery, marketplaceLimit])

  useEffect(() => {
    setMarketplaceLimit(marketplacePageSize)
  }, [marketplaceQuery])

  useEffect(() => {
    void runRuntimeCheck()
  }, [data.project.id])

  const runRuntimeCheck = async () => {
    setBusy(true)
    setError(null)
    try {
      setRuntimeCheck(await checkMcpServers(data.project.id))
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to check OpenCode MCP status')
    } finally {
      setBusy(false)
    }
  }

  const openInstallForm = (item: McpMarketplaceItem) => {
    setInstallForm({
      item,
      name: item.installName || item.id.split('/').pop() || item.id,
      url: item.url || '',
      apiKey: '',
      apiKeyEnvVar: item.apiKeyEnvVar,
    })
    setStatusMessage(null)
    setError(null)
  }

  const submitInstall = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!installForm) return
    setBusy(true)
    setError(null)
    setStatusMessage(null)
    try {
      const result = await installMcpServer(data.project.id, {
        marketplaceId: installForm.item.id,
        name: installForm.name,
        url: installForm.url || undefined,
        apiKey: installForm.apiKey || undefined,
        apiKeyEnvVar: installForm.apiKeyEnvVar || undefined,
      })
      setInstallForm(null)
      setRuntimeCheck(result.runtimeStatus ? { health: { status: 'online', baseUrl: 'OpenCode server', version: 'unknown' }, status: result.runtimeStatus } : null)
      setStatusMessage(result.runtimeError
        ? `Installed ${result.server.name} into opencode.json, but runtime check failed: ${result.runtimeError}`
        : `Installed ${result.server.name} into opencode.json and checked OpenCode MCP status.`)
      onRefresh()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to install MCP server')
    } finally {
      setBusy(false)
    }
  }

  const removeServer = async (server: McpServer) => {
    if (server.scope !== 'project') return
    if (!window.confirm(`Remove MCP server "${server.name}" from opencode.json?`)) return
    setBusy(true)
    setError(null)
    setStatusMessage(null)
    try {
      await removeMcpServer(data.project.id, server.name)
      setRuntimeCheck(null)
      setStatusMessage(`Removed ${server.name} from opencode.json and restarted OpenCode.`)
      await onRefresh()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to remove MCP server')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page-stack">
      {error && <div className="global-error">{error}</div>}
      {statusMessage && <div className="success-banner">{statusMessage}</div>}

      <section className="mcp-section">
        <div className="section-heading">
          <div>
            <span>OpenCode config</span>
            <h2>Configured MCP servers</h2>
          </div>
          <button className="toolbar-button" type="button" onClick={runRuntimeCheck} disabled={busy}>
            <RefreshCw size={16} />
            <span>{busy ? 'Checking...' : 'Check OpenCode'}</span>
          </button>
        </div>
        {configuredServers.length > 0 ? (
          <>
            {missingRuntimeServers.length > 0 && (
              <div className="status-note warning">
                {missingRuntimeServers.map((server) => server.name).join(', ')} is declared in config but not loaded by the current OpenCode runtime.
              </div>
            )}
            <McpTable
              busy={busy}
              servers={configuredServers}
              runtimeStatus={runtimeCheck?.status ?? null}
              onRemove={removeServer}
            />
          </>
        ) : (
          <EmptyState title="No MCP servers" detail="No MCP server is declared in global OpenCode config or project opencode.json." />
        )}
      </section>

      <section className="mcp-section">
        <div className="section-heading">
          <div>
            <span>MCP Marketplace</span>
            <h2>Search and install MCP servers</h2>
          </div>
        </div>
        <div className="mcp-marketplace-controls">
          <label className="mcp-search-field">
            <Search size={17} />
            <input
              value={marketplaceQuery}
              placeholder="Type to search MCP servers"
              onChange={(event) => setMarketplaceQuery(event.target.value)}
            />
            {marketplaceQuery && (
              <button type="button" onClick={() => setMarketplaceQuery('')}>
                Clear
              </button>
            )}
          </label>
        </div>
        {loadingMarketplace && <div className="data-state compact">Searching MCP registry...</div>}
        {!loadingMarketplace && marketplace.length === 0 ? (
          <EmptyState title="No MCP servers found" detail="Try a different search term." />
        ) : (
          <>
            <div className="mcp-marketplace-grid">
              {marketplace.map((item) => {
                const installed = installedMarketplaceIds.has(item.id)
                const installable = item.installable !== false
                return (
                  <article className={`mcp-marketplace-card${installed ? ' installed' : ''}`} key={item.id}>
                    <div className="mcp-card-title">
                      <PlugZap aria-hidden="true" size={18} />
                      <strong>{item.name}</strong>
                    </div>
                    <p>{item.description}</p>
                    <code>{item.url || item.packageIdentifier || item.id}</code>
                    <button
                      className="toolbar-button accent"
                      type="button"
                      onClick={() => openInstallForm(item)}
                      disabled={installed || !installable}
                    >
                      <KeyRound size={16} />
                      <span>{installed ? 'Installed' : installable ? 'Install' : 'Manual setup'}</span>
                    </button>
                  </article>
                )
              })}
            </div>
            {marketplace.length >= marketplaceLimit && (
              <button
                className="toolbar-button mcp-see-more"
                type="button"
                disabled={loadingMarketplace}
                onClick={() => setMarketplaceLimit((limit) => limit + marketplacePageSize)}
              >
                See More
              </button>
            )}
          </>
        )}
      </section>

      {installForm && (
        <div className="modal-backdrop" role="presentation">
          <form className="mcp-install-modal" onSubmit={submitInstall}>
            <div className="modal-title-row">
              <div>
                <span>MCP install</span>
                <h2>{installForm.item.name}</h2>
              </div>
              <button className="icon-button" type="button" aria-label="Close install form" onClick={() => setInstallForm(null)}>
                <X size={18} />
              </button>
            </div>
            <label>
              Server name
              <input value={installForm.name} onChange={(event) => setInstallForm({ ...installForm, name: event.target.value })} />
            </label>
            {installForm.item.url ? (
              <label>
                URL
                <input value={installForm.url} onChange={(event) => setInstallForm({ ...installForm, url: event.target.value })} />
              </label>
            ) : (
              <label>
                Package
                <input readOnly value={installForm.item.packageIdentifier || installForm.item.id} />
              </label>
            )}
            {installForm.item.apiKeyHeader && (
              <>
                <label>
                  API key
                  <input type="password" value={installForm.apiKey} onChange={(event) => setInstallForm({ ...installForm, apiKey: event.target.value })} placeholder="Used once; not written to opencode.json" />
                </label>
                <label>
                  Env reference written to config
                  <input value={installForm.apiKeyEnvVar} onChange={(event) => setInstallForm({ ...installForm, apiKeyEnvVar: event.target.value })} />
                </label>
                <p className="modal-note">
                  The raw key is not persisted. `opencode.json` stores an env reference and the backend injects the key into the current OpenCode runtime for the status check.
                </p>
              </>
            )}
            <button className="toolbar-button accent" type="submit" disabled={busy}>
              <CheckCircle2 size={16} />
              <span>{busy ? 'Installing...' : 'Install MCP'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

function McpTable({
  busy,
  servers,
  runtimeStatus,
  onRemove,
}: {
  busy: boolean
  servers: McpServer[]
  runtimeStatus: Record<string, unknown> | null
  onRemove: (server: McpServer) => Promise<void>
}) {
  const hasRuntimeSnapshot = runtimeStatus !== null

  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>Server</th>
            <th>Scope</th>
            <th>Transport</th>
            <th>Enabled</th>
            <th>Runtime</th>
            <th>Risk</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {servers.map((server) => {
            const runtime = runtimeStatus?.[server.name]
            return (
              <tr key={`${server.scope}-${server.name}`}>
                <td>
                  <strong>{server.name}</strong>
                  {server.url && <small>{server.url}</small>}
                </td>
                <td>{server.scope}</td>
                <td>{server.transport}</td>
                <td>
                  <StatusBadge tone={server.enabled ? 'success' : 'neutral'} label={server.enabled ? 'enabled' : 'disabled'} />
                </td>
                <td>{runtime ? <RuntimeStatus value={runtime} /> : <span>{hasRuntimeSnapshot ? 'not loaded' : 'not checked'}</span>}</td>
                <td>
                  <RiskBadge risk={server.risk} />
                </td>
                <td>
                  <button
                    className="danger-action"
                    type="button"
                    aria-label={`Remove ${server.name}`}
                    title={server.scope === 'project' ? 'Remove from opencode.json' : 'Only project MCP servers can be removed here'}
                    disabled={busy || server.scope !== 'project'}
                    onClick={() => void onRemove(server)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function RuntimeStatus({ value }: { value: unknown }) {
  if (typeof value === 'string') return <span>{value}</span>
  if (!value || typeof value !== 'object') return <span>unknown</span>
  const record = value as Record<string, unknown>
  const status = typeof record.status === 'string' ? record.status : JSON.stringify(record)
  return <span>{status}</span>
}
