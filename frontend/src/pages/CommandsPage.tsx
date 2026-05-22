import { useEffect, useMemo, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Info, Plus, Terminal, Trash2, X } from 'lucide-react'
import type { AppState, CommandItem } from '../types/appData'
import type { ActionHandlers } from '../types/actionHandlers'
import { createCommand, getCommand, removeCommand } from '../services/appDataService'
import { EmptyState, StatusBadge } from '../components/common/Primitives'
import { fuzzyMatch } from '../utils/fuzzyMatch'

type CommandFormState = {
  name: string
  description: string
  agent: string
  model: string
  template: string
}

const emptyForm: CommandFormState = {
  name: '',
  description: '',
  agent: '',
  model: '',
  template: '',
}

const uniqueSorted = (values: Array<string | undefined>) =>
  Array.from(new Set(values.map((value) => value?.trim()).filter((value): value is string => !!value && value !== 'default' && value !== 'not declared'))).sort((left, right) =>
    left.localeCompare(right),
  )

export function CommandsPage({
  data,
  onRefresh,
}: {
  data: AppState
  actions: ActionHandlers
  onRefresh: () => void
}) {
  const [detail, setDetail] = useState<CommandItem | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState<CommandFormState>(emptyForm)
  const [activeCommand, setActiveCommand] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const agentOptions = uniqueSorted([...data.agents.map((agent) => agent.name), ...data.commands.map((command) => command.agent)])
  const modelOptions = uniqueSorted([...data.models, ...data.agents.map((agent) => agent.model), ...data.commands.map((command) => command.model)])

  const handleShowDetail = async (command: CommandItem) => {
    setActiveCommand(command.name)
    setError(null)
    try {
      setDetail(await getCommand(data.project.id, command.name))
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load command detail')
    } finally {
      setActiveCommand(null)
    }
  }

  const handleRemove = async (command: CommandItem) => {
    if (command.builtIn) return
    if (!window.confirm(`Remove command "/${command.name}"?`)) return
    setActiveCommand(command.name)
    setError(null)
    try {
      await removeCommand(data.project.id, command.name)
      if (detail?.name === command.name) setDetail(null)
      await onRefresh()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to remove command')
    } finally {
      setActiveCommand(null)
    }
  }

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setActiveCommand(form.name)
    try {
      const created = await createCommand(data.project.id, {
        name: form.name,
        description: form.description,
        agent: form.agent || undefined,
        model: form.model || undefined,
        template: form.template,
      })
      setCreateOpen(false)
      setForm(emptyForm)
      setDetail(created)
      await onRefresh()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to create command')
    } finally {
      setActiveCommand(null)
    }
  }

  return (
    <div className="page-stack">
      <div className="toolbar">
        <button className="toolbar-button accent" type="button" onClick={() => setCreateOpen(true)}>
          <Plus size={17} />
          <span>Create Command</span>
        </button>
      </div>
      {error && <div className="data-state error compact">{error}</div>}
      {data.commands.length > 0 ? (
        <div className="command-grid">
          {data.commands.map((command) => (
            <CommandCard
              command={command}
              disabled={activeCommand === command.name}
              key={`${command.sourcePath}-${command.name}`}
              onRemove={handleRemove}
              onShowDetail={handleShowDetail}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No commands found" detail="Create .opencode/commands/*.md to populate this page." />
      )}
      {detail && <CommandDetailModal command={detail} onClose={() => setDetail(null)} />}
      {createOpen && (
        <CommandFormModal
          form={form}
          busy={!!activeCommand}
          agentOptions={agentOptions}
          modelOptions={modelOptions}
          agents={data.agents}
          onChange={setForm}
          onClose={() => setCreateOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  )
}

function CommandCard({
  command,
  disabled,
  onRemove,
  onShowDetail,
}: {
  command: CommandItem
  disabled: boolean
  onRemove: (command: CommandItem) => Promise<void>
  onShowDetail: (command: CommandItem) => Promise<void>
}) {
  return (
    <article className="data-card command-card">
      <Terminal size={18} />
      <div>
        <h3>/{command.name}</h3>
        <small>{command.description}</small>
      </div>
      <StatusBadge tone={command.builtIn ? 'info' : 'success'} label={command.builtIn ? 'built-in' : command.source} />
      <div className="card-actions">
        <button type="button" aria-label={`Show ${command.name} detail`} title="Show Detail" disabled={disabled} onClick={() => void onShowDetail(command)}>
          <Info size={16} />
        </button>
        <button className="danger-action" type="button" aria-label={`Remove ${command.name}`} title={command.builtIn ? 'Built-in commands cannot be removed' : 'Remove'} disabled={disabled || command.builtIn} onClick={() => void onRemove(command)}>
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  )
}

function CommandDetailModal({ command, onClose }: { command: CommandItem; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="command-modal" role="dialog" aria-modal="true" aria-labelledby="command-detail-title">
        <ModalHeader eyebrow="Command detail" title={`/${command.name}`} onClose={onClose} />
        <div className="command-form-grid">
          <ReadonlyField label="Name" value={command.name} />
          <ReadonlyField label="Source" value={command.builtIn ? 'built-in' : command.source} />
          <ReadonlyField label="Description" value={command.description} wide />
          <ReadonlyField label="Agent" value={command.agent ?? 'default'} />
          <ReadonlyField label="Model" value={command.model ?? 'default'} />
          <ReadonlyField label="Source path" value={command.sourcePath} wide />
        </div>
        <label>
          Template
          <textarea readOnly value={command.template || command.preview || ''} />
        </label>
      </section>
    </div>
  )
}

function CommandFormModal({
  form,
  busy,
  agentOptions,
  modelOptions,
  agents,
  onChange,
  onClose,
  onSubmit,
}: {
  form: CommandFormState
  busy: boolean
  agentOptions: string[]
  modelOptions: string[]
  agents: AppState['agents']
  onChange: (form: CommandFormState) => void
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const handleAgentChange = (agentName: string) => {
    const selectedAgent = agents.find((agent) => agent.name === agentName)
    const agentModel = selectedAgent?.model && selectedAgent.model !== 'default' ? selectedAgent.model : ''
    onChange({
      ...form,
      agent: agentName,
      model: form.model || agentModel,
    })
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="command-modal" onSubmit={onSubmit}>
        <ModalHeader eyebrow="Create Command" title="New slash command" onClose={onClose} />
        <div className="command-form-grid">
          <label>
            Name
            <input required value={form.name} placeholder="test" onChange={(event) => onChange({ ...form, name: event.target.value })} />
          </label>
          <TypeaheadField label="Agent" value={form.agent} options={agentOptions} defaultLabel="Default agent" placeholder="Type agent name" onChange={handleAgentChange} />
          <label className="wide">
            Description
            <input required value={form.description} placeholder="Run tests with coverage" onChange={(event) => onChange({ ...form, description: event.target.value })} />
          </label>
          <TypeaheadField label="Model" value={form.model} options={modelOptions} defaultLabel="Default model" placeholder="Type model name" wide onChange={(model) => onChange({ ...form, model })} />
        </div>
        <label>
          Template
          <textarea required value={form.template} placeholder="Run the full test suite and summarize failures." onChange={(event) => onChange({ ...form, template: event.target.value })} />
        </label>
        <p className="modal-note">This creates a markdown command at `.opencode/commands/&lt;name&gt;.md`.</p>
        <button className="toolbar-button accent" type="submit" disabled={busy}>
          <Plus size={16} />
          <span>{busy ? 'Creating...' : 'Create Command'}</span>
        </button>
      </form>
    </div>
  )
}

function TypeaheadField({
  label,
  value,
  options,
  defaultLabel,
  placeholder,
  wide = false,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  defaultLabel: string
  placeholder: string
  wide?: boolean
  onChange: (value: string) => void
}) {
  const [query, setQuery] = useState(value || '')
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setQuery(value || '')
  }, [value])
  const visibleOptions = useMemo(() => {
    const filtered = query ? options.filter((option) => fuzzyMatch(option, query)) : options
    return filtered.slice(0, 12)
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
    <label className={wide ? 'wide' : undefined}>
      {label}
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

function ModalHeader({ eyebrow, title, onClose }: { eyebrow: string; title: string; onClose: () => void }) {
  return (
    <div className="modal-title-row">
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <button className="icon-button" type="button" aria-label="Close command modal" onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  )
}

function ReadonlyField({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <label className={wide ? 'wide' : undefined}>
      {label}
      <input readOnly value={value} />
    </label>
  )
}
