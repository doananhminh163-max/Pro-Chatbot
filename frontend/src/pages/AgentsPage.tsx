import { Info, PencilLine, Plus, Save, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type KeyboardEvent } from 'react'
import type { AgentDetail, AgentItem, AppState, ConfigChange } from '../types/appData'
import type { ActionHandlers } from '../types/actionHandlers'
import { getAgent, removeAgent, updateAgent } from '../services/appDataService'
import { EmptyState } from '../components/common/Primitives'
import { fuzzyMatch } from '../utils/fuzzyMatch'

type AgentFormState = {
  description: string
  temperature: string
  maxSteps: string
  disable: boolean
  prompt: string
  model: string
  permission: PermissionMap
  mode: string
  taskPermission: TaskPermissionMap
  topP: string
}

type PermissionAction = 'ask' | 'allow' | 'deny'
type PermissionKey =
  | 'read'
  | 'edit'
  | 'glob'
  | 'grep'
  | 'bash'
  | 'task'
  | 'skill'
  | 'lsp'
  | 'question'
  | 'webfetch'
  | 'websearch'
  | 'external_directory'
  | 'doom_loop'

type PermissionMap = Record<PermissionKey, PermissionAction>
type TaskPermissionMap = Record<string, PermissionAction>

type PermissionOptionItem<Key extends string = string> = {
  key: Key
  label: string
  description: string
}

const permissionActions: PermissionAction[] = ['ask', 'allow', 'deny']

const permissionItems: Array<PermissionOptionItem<PermissionKey>> = [
  { key: 'read', label: 'read', description: 'reading a file (matches the file path)' },
  { key: 'edit', label: 'edit', description: 'all file modifications (covers edit, write, patch)' },
  { key: 'glob', label: 'glob', description: 'file globbing (matches the glob pattern)' },
  { key: 'grep', label: 'grep', description: 'content search (matches the regex pattern)' },
  { key: 'bash', label: 'bash', description: 'running shell commands (matches parsed commands like git status --porcelain)' },
  { key: 'task', label: 'task', description: 'launching subagents (matches the subagent type)' },
  { key: 'skill', label: 'skill', description: 'loading a skill (matches the skill name)' },
  { key: 'lsp', label: 'lsp', description: 'running LSP queries (currently non-granular)' },
  { key: 'question', label: 'question', description: 'asking the user questions during execution' },
  { key: 'webfetch', label: 'webfetch', description: 'fetching a URL (matches the URL)' },
  { key: 'websearch', label: 'websearch', description: 'web search (matches the query)' },
  { key: 'external_directory', label: 'external_directory', description: 'triggered when a tool touches paths outside the project working directory' },
  { key: 'doom_loop', label: 'doom_loop', description: 'triggered when the same tool call repeats 3 times with identical input' },
]

const detailFields = [
  { key: 'description', label: 'Description' },
  { key: 'temperature', label: 'Temperature' },
  { key: 'maxSteps', label: 'Max steps' },
  { key: 'disable', label: 'Disable' },
  { key: 'prompt', label: 'Prompt' },
  { key: 'model', label: 'Model' },
  { key: 'tools', label: 'Tools' },
  { key: 'permission', label: 'Permissions' },
  { key: 'mode', label: 'Mode' },
  { key: 'taskPermission', label: 'Task permissions' },
  { key: 'topP', label: 'Top P' },
] as const

export function AgentsPage({
  data,
  actions,
  onRefresh,
  onPreviewChange,
}: {
  data: AppState
  actions: ActionHandlers
  onRefresh: () => void
  onPreviewChange: (change: ConfigChange) => void
}) {
  const [detail, setDetail] = useState<AgentDetail | null>(null)
  const [editing, setEditing] = useState<AgentDetail | null>(null)
  const [activeAgent, setActiveAgent] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const agents = data.agents
  const availableSubagents = useMemo(
    () => agents.filter((agent) => normalizeMode(agent.mode) === 'subagent').map((agent) => agent.name),
    [agents],
  )
  const modelOptions = useMemo(
    () => uniqueSorted([...data.models, ...agents.map((agent) => agent.model)]),
    [agents, data.models],
  )

  const handleShowDetail = async (agent: AgentItem) => {
    setActiveAgent(agent.name)
    setError(null)
    try {
      setDetail(await getAgent(data.project.id, agent.name))
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load agent detail')
    } finally {
      setActiveAgent(null)
    }
  }

  const handleOpenUpdate = async (agent: AgentItem) => {
    setActiveAgent(agent.name)
    setError(null)
    try {
      setEditing(await getAgent(data.project.id, agent.name))
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load agent for update')
    } finally {
      setActiveAgent(null)
    }
  }

  const handleRemove = async (agent: AgentItem) => {
    if (agent.builtIn) return
    if (!window.confirm(`Remove agent "${agent.name}"?`)) return
    setActiveAgent(agent.name)
    setError(null)
    setStatusMessage(null)
    try {
      await removeAgent(data.project.id, agent.name)
      if (detail?.name === agent.name) setDetail(null)
      if (editing?.name === agent.name) setEditing(null)
      setStatusMessage(`Removed ${agent.name}.`)
      await onRefresh()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to remove agent')
    } finally {
      setActiveAgent(null)
    }
  }

  const handleSave = async (agentName: string, form: AgentFormState) => {
    setActiveAgent(agentName)
    setError(null)
    setStatusMessage(null)
    try {
      const change = await updateAgent(data.project.id, agentName, {
        description: toOptionalString(form.description),
        temperature: toOptionalNumber(form.temperature),
        maxSteps: toOptionalNumber(form.maxSteps),
        disable: form.disable,
        prompt: toOptionalString(form.prompt),
        model: toOptionalString(form.model),
        permission: form.permission,
        mode: toOptionalString(form.mode),
        taskPermission: isPrimaryMode(form.mode) ? nonEmptyTaskPermission(form.taskPermission) : undefined,
        topP: toOptionalNumber(form.topP),
      })
      onPreviewChange(change)
      setEditing(null)
      setStatusMessage(`Update preview created for ${agentName}. Confirm apply in the detail panel to write the file.`)
      await onRefresh()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to update agent')
    } finally {
      setActiveAgent(null)
    }
  }

  return (
    <div className="page-stack">
      <div className="toolbar">
        <button className="toolbar-button accent" type="button" onClick={actions.createAgentProposal}>
          <Plus size={17} />
          <span>Create Agent</span>
        </button>
      </div>
      {error && <div className="data-state error compact">{error}</div>}
      {statusMessage && <div className="success-banner">{statusMessage}</div>}
      {agents.length > 0 ? (
        <div className="card-grid">
          {agents.map((agent) => (
            <AgentRow
              agent={agent}
              busy={activeAgent === agent.name}
              canRemove={isProjectAgent(agent, data.project.rootPath)}
              canUpdate={agent.builtIn || isProjectAgent(agent, data.project.rootPath)}
              key={`${agent.sourcePath}-${agent.name}`}
              onRemove={handleRemove}
              onShowDetail={handleShowDetail}
              onUpdate={handleOpenUpdate}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No agents found" detail="No agents were returned by the OpenCode API or local agent scan." />
      )}
      {detail && <AgentDetailModal agent={detail} onClose={() => setDetail(null)} />}
      {editing && (
        <AgentUpdateModal
          agent={editing}
          busy={activeAgent === editing.name}
          modelOptions={modelOptions}
          subagents={availableSubagents.filter((name) => name !== editing.name)}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function AgentRow({
  agent,
  busy,
  canRemove,
  canUpdate,
  onRemove,
  onShowDetail,
  onUpdate,
}: {
  agent: AgentItem
  busy: boolean
  canRemove: boolean
  canUpdate: boolean
  onRemove: (agent: AgentItem) => Promise<void>
  onShowDetail: (agent: AgentItem) => Promise<void>
  onUpdate: (agent: AgentItem) => Promise<void>
}) {
  return (
    <article className="data-card skill-card agent-card">
      <h3>{agent.name}</h3>
      <div className="card-actions">
        <button type="button" aria-label={`Show ${agent.name} detail`} title="Show detail" disabled={busy} onClick={() => void onShowDetail(agent)}>
          <Info size={16} />
        </button>
        <button type="button" aria-label={`Update ${agent.name}`} title={agent.builtIn ? 'Override built-in agent in project config' : canUpdate ? 'Update' : 'Only project agents can be updated'} disabled={busy || !canUpdate} onClick={() => void onUpdate(agent)}>
          <PencilLine size={16} />
        </button>
        <button className="danger-action" type="button" aria-label={`Remove ${agent.name}`} title={canRemove ? 'Remove' : 'Only project agents can be removed'} disabled={busy || !canRemove} onClick={() => void onRemove(agent)}>
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  )
}

function AgentDetailModal({ agent, onClose }: { agent: AgentDetail; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="agent-modal" role="dialog" aria-modal="true" aria-labelledby="agent-detail-title">
        <ModalHeader eyebrow="Agent detail" title={agent.name} onClose={onClose} />
        <div className="agent-settings-list">
          {detailFields.map((field) => (
            <AgentSettingRow label={field.label} value={formatDetailValue(agent[field.key])} key={field.key} />
          ))}
        </div>
      </section>
    </div>
  )
}

function AgentUpdateModal({
  agent,
  busy,
  modelOptions,
  subagents,
  onClose,
  onSave,
}: {
  agent: AgentDetail
  busy: boolean
  modelOptions: string[]
  subagents: string[]
  onClose: () => void
  onSave: (agentName: string, form: AgentFormState) => Promise<void>
}) {
  const initialForm = useMemo(() => toFormState(agent, subagents), [agent, subagents])
  const [form, setForm] = useState<AgentFormState>(initialForm)

  useEffect(() => {
    setForm(initialForm)
  }, [initialForm])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void onSave(agent.name, form)
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="agent-modal" onSubmit={submit}>
        <ModalHeader eyebrow="Update agent" title={agent.name} onClose={onClose} />
        <div className="agent-edit-list">
          <EditableAgentField label="Description" value={form.description} onChange={(description) => setForm({ ...form, description })} />
          <EditableAgentField label="Temperature" value={form.temperature} onChange={(temperature) => setForm({ ...form, temperature })} />
          <EditableAgentField label="Max steps" value={form.maxSteps} onChange={(maxSteps) => setForm({ ...form, maxSteps })} />
          <label className="agent-edit-row checkbox-row">
            <strong>Disable</strong>
            <input type="checkbox" checked={form.disable} onChange={(event) => setForm({ ...form, disable: event.target.checked })} />
          </label>
          <EditableAgentField label="Prompt" value={form.prompt} multiline onChange={(prompt) => setForm({ ...form, prompt })} />
          <TypeaheadAgentField
            label="Model"
            value={form.model}
            options={modelOptions}
            defaultLabel="Default model"
            placeholder="Type model name"
            onChange={(model) => setForm({ ...form, model })}
          />
          <PermissionEditor
            title="Permissions"
            items={permissionItems}
            value={form.permission}
            namePrefix={`${agent.name}-permission`}
            onChange={(key, action) => setForm({ ...form, permission: { ...form.permission, [key]: action } })}
          />
          <EditableAgentField label="Mode" value={form.mode} onChange={(mode) => setForm({ ...form, mode })} />
          {isPrimaryMode(form.mode) && (
            <PermissionEditor
              title="Task permissions"
              emptyDetail="No project subagents found."
              items={subagents.map((name) => ({ key: name, label: name, description: 'project subagent' }))}
              value={form.taskPermission}
              namePrefix={`${agent.name}-task-permission`}
              onChange={(key, action) => setForm({ ...form, taskPermission: { ...form.taskPermission, [key]: action } })}
            />
          )}
          <EditableAgentField label="Top P" value={form.topP} onChange={(topP) => setForm({ ...form, topP })} />
        </div>
        <button className="toolbar-button accent" type="submit" disabled={busy}>
          <Save size={16} />
          <span>{busy ? 'Saving...' : 'Save'}</span>
        </button>
      </form>
    </div>
  )
}

function TypeaheadAgentField({
  label,
  value,
  options,
  defaultLabel,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  defaultLabel: string
  placeholder: string
  onChange: (value: string) => void
}) {
  const [query, setQuery] = useState(value || '')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setQuery(value || '')
  }, [value])

  const visibleOptions = useMemo(() => {
    return query ? options.filter((option) => fuzzyMatch(option, query)) : options
  }, [options, query])

  const selectValue = (nextValue: string) => {
    setQuery(nextValue)
    onChange(nextValue)
    setOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && open && visibleOptions.length > 0) {
      event.preventDefault()
      selectValue(visibleOptions[0])
    }
    if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <label className="agent-edit-row">
      <strong>{label}</strong>
      <div className="typeahead-field">
        <input
          value={query}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-label={label}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            if (!event.target.value.trim()) onChange('')
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <button type="button" aria-label={`Use ${defaultLabel}`} title={defaultLabel} onMouseDown={(event) => event.preventDefault()} onClick={() => selectValue('')}>
          {value ? 'Reset' : defaultLabel}
        </button>
        {open && (
          <div className="typeahead-menu" role="listbox">
            <button type="button" role="option" onMouseDown={(event) => event.preventDefault()} onClick={() => selectValue('')}>
              {defaultLabel}
            </button>
            {visibleOptions.map((option) => (
              <button type="button" role="option" key={option} onMouseDown={(event) => event.preventDefault()} onClick={() => selectValue(option)}>
                {option}
              </button>
            ))}
            {visibleOptions.length === 0 && <span>No matching {label.toLowerCase()}</span>}
          </div>
        )}
      </div>
    </label>
  )
}

function PermissionEditor<Key extends string>({
  title,
  items,
  value,
  namePrefix,
  emptyDetail = 'No items.',
  onChange,
}: {
  title: string
  items: Array<PermissionOptionItem<Key>>
  value: Record<Key, PermissionAction> | Record<string, PermissionAction>
  namePrefix: string
  emptyDetail?: string
  onChange: (key: Key, action: PermissionAction) => void
}) {
  return (
    <details className="agent-edit-row permission-editor">
      <summary>
        <strong>{title}</strong>
        <span>Click to configure ask / allow / deny</span>
      </summary>
      <div className="permission-list">
        {items.length > 0 ? (
          items.map((item) => (
            <div className="permission-choice-row" key={item.key}>
              <div>
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </div>
              <div className="permission-choice-actions" role="radiogroup" aria-label={`${title}: ${item.label}`}>
                {permissionActions.map((action) => (
                  <label key={action}>
                    <input
                      type="radio"
                      name={`${namePrefix}-${item.key}`}
                      checked={(value as Record<string, PermissionAction>)[item.key] === action}
                      onChange={() => onChange(item.key, action)}
                    />
                    <span>{action}</span>
                  </label>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="permission-empty">{emptyDetail}</p>
        )}
      </div>
    </details>
  )
}

function ModalHeader({ eyebrow, title, onClose }: { eyebrow: string; title: string; onClose: () => void }) {
  return (
    <div className="modal-title-row">
      <div>
        <span>{eyebrow}</span>
        <h2 id="agent-detail-title">{title}</h2>
      </div>
      <button className="icon-button" type="button" aria-label="Close agent modal" onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  )
}

function AgentSettingRow({ label, value }: { label: string; value: string }) {
  return (
    <article className="setting-row agent-setting-row">
      <div>
        <strong>{label}</strong>
        <span>{value}</span>
      </div>
    </article>
  )
}

function EditableAgentField({
  label,
  value,
  multiline = false,
  onChange,
}: {
  label: string
  value: string
  multiline?: boolean
  onChange: (value: string) => void
}) {
  return (
    <label className="agent-edit-row">
      <strong>{label}</strong>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  )
}

function toFormState(agent: AgentDetail, subagents: string[]): AgentFormState {
  return {
    description: agent.description ?? '',
    temperature: formatDetailValue(agent.temperature),
    maxSteps: formatDetailValue(agent.maxSteps),
    disable: agent.disable ?? false,
    prompt: agent.prompt ?? '',
    model: agent.model ?? '',
    permission: toPermissionMap(agent.permission),
    mode: agent.mode ?? '',
    taskPermission: toTaskPermissionMap(agent.taskPermission, subagents),
    topP: formatDetailValue(agent.topP),
  }
}

function formatDetailValue(value: unknown) {
  if (value === undefined || value === null || value === '') return ''
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value)
  return JSON.stringify(value, null, 2)
}

function toOptionalString(value: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

function toOptionalNumber(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed)) {
    throw new Error('Temperature, Max steps and Top P must be valid numbers.')
  }
  return parsed
}

function toPermissionMap(value: unknown): PermissionMap {
  const record = asRecord(value)
  return permissionItems.reduce((result, item) => {
    result[item.key] = toPermissionAction(record?.[item.key])
    return result
  }, {} as PermissionMap)
}

function toTaskPermissionMap(value: unknown, subagents: string[]): TaskPermissionMap {
  const record = asRecord(value)
  return subagents.reduce((result, name) => {
    result[name] = toPermissionAction(record?.[name] ?? record?.['*'])
    return result
  }, {} as TaskPermissionMap)
}

function toPermissionAction(value: unknown): PermissionAction {
  return typeof value === 'string' && permissionActions.includes(value as PermissionAction) ? value as PermissionAction : 'ask'
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null
}

function nonEmptyTaskPermission(value: TaskPermissionMap) {
  return Object.keys(value).length > 0 ? value : undefined
}

function isPrimaryMode(mode: string | undefined) {
  return normalizeMode(mode) === 'primary'
}

function normalizeMode(mode: string | undefined) {
  return (mode ?? '').trim().toLowerCase()
}

function uniqueSorted(values: Array<string | undefined>) {
  return Array.from(new Set(values.map((value) => value?.trim()).filter((value): value is string => !!value)))
    .sort((left, right) => left.localeCompare(right))
}

function normalizePath(path: string | undefined) {
  return (path ?? '').replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase()
}

function isProjectAgent(agent: AgentItem, rootPath: string) {
  const sourcePath = normalizePath(agent.sourcePath)
  const projectRoot = normalizePath(rootPath)
  return !agent.builtIn && Boolean(sourcePath && projectRoot && sourcePath.startsWith(`${projectRoot}/`))
}
