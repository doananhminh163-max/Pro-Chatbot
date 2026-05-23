import { type KeyboardEvent, useEffect, useMemo, useState } from 'react'
import {
  ChevronRight,
  FolderOpen,
  Plus,
  Settings2,
  Trash2,
  X,
} from 'lucide-react'
import { StatusBadge } from '../components/common/Primitives'
import { searchProjectPaths, uploadInstructionFiles } from '../services/appDataService'
import type { AppState, ProjectPathReference, ProviderItem } from '../types/appData'
import { fuzzyMatch } from '../utils/fuzzyMatch'
import {
  BUILT_IN_FORMATTERS,
  BUILT_IN_LSP_SERVERS,
  buildConfigSettingCards,
  buildDraftValues,
  buildFormFields,
  buildPatchFromForm,
  formValuesEqual,
  formatterDisabledKey,
  lineValues,
  lspDisabledKey,
  mergeConfigPatch,
  providerDisabledKey,
  type ConfigFormField,
  type ConfigFormValue,
  type ConfigFormValues,
  type ConfigSettingCard,
} from '../features/config-settings/configSettingsSchema'

export function ConfigSettingsPage({
  data,
  onRequestChange,
}: {
  data: AppState
  onRequestChange?: (title: string, patch: Record<string, unknown>) => void
}) {
  const config = useMemo(() => data.config.effective ?? {}, [data.config.effective])
  const cards = useMemo(() => buildConfigSettingCards(config), [config])
  const initialDraftValues = useMemo(() => buildDraftValues(cards, data.providers), [cards, data.providers])
  const draftKey = useMemo(() => JSON.stringify(initialDraftValues), [initialDraftValues])
  const [requestedActiveTitle, setRequestedActiveTitle] = useState(cards[0]?.title ?? '')
  const [draftState, setDraftState] = useState<{ key: string; values: Record<string, ConfigFormValues> }>(() => ({
    key: draftKey,
    values: initialDraftValues,
  }))
  const [previewErrorState, setPreviewErrorState] = useState<{ key: string; message: string | null }>(() => ({
    key: draftKey,
    message: null,
  }))
  const draftValuesByTitle = draftState.key === draftKey ? draftState.values : initialDraftValues
  const previewError = previewErrorState.key === draftKey ? previewErrorState.message : null
  const activeCard = cards.find((card) => card.title === requestedActiveTitle) ?? cards[0]
  const dirtyTitles = useMemo(
    () => cards
      .filter((card) => !formValuesEqual(
        draftValuesByTitle[card.title] ?? initialDraftValues[card.title] ?? {},
        initialDraftValues[card.title] ?? {},
      ))
      .map((card) => card.title),
    [cards, draftValuesByTitle, initialDraftValues],
  )

  if (!activeCard) return null

  const setPreviewErrorForCurrentDraft = (message: string | null) => {
    setPreviewErrorState({ key: draftKey, message })
  }

  const updateDraftValue = (title: string, name: string, value: ConfigFormValue) => {
    setDraftState((current) => {
      const values = current.key === draftKey ? current.values : initialDraftValues
      return {
        key: draftKey,
        values: {
          ...values,
          [title]: {
            ...(values[title] ?? initialDraftValues[title] ?? {}),
            [name]: value,
          },
        },
      }
    })
  }

  const previewAllChanges = () => {
    if (!onRequestChange || dirtyTitles.length === 0) return
    setPreviewErrorForCurrentDraft(null)
    try {
      const patch = dirtyTitles.reduce<Record<string, unknown>>((mergedPatch, title) => {
        const card = cards.find((candidate) => candidate.title === title)
        if (!card) return mergedPatch
        const nextPatch = buildPatchFromForm(
          card,
          draftValuesByTitle[title] ?? initialDraftValues[title] ?? {},
          data.providers,
        )
        return mergeConfigPatch(mergedPatch, nextPatch)
      }, {})
      onRequestChange('Settings', patch)
    } catch (error) {
      setPreviewErrorForCurrentDraft(error instanceof Error ? error.message : 'Invalid setting value')
    }
  }

  return (
    <section className="config-settings-page">
      <div className="config-settings-summary">
        <div>
          <span>Project config</span>
          <h2>{data.config.previewPath ? fileName(data.config.previewPath) : 'opencode.json'}</h2>
        </div>
        <div className="config-summary-actions">
          <div className="config-source-stack">
            <small>Project config</small>
            <code>{data.config.previewPath ?? 'not found'}</code>
          </div>
          {onRequestChange && (
            <div className="config-preview-stack">
              <small>{dirtyTitles.length ? `${dirtyTitles.length} section(s) edited` : 'No pending edits'}</small>
              <button className="toolbar-button accent" disabled={dirtyTitles.length === 0} type="button" onClick={previewAllChanges}>
                <Settings2 size={16} />
                <span>Preview change</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {previewError && <div className="config-form-error config-preview-error">{previewError}</div>}

      <div className="config-settings-layout">
        <aside className="config-settings-sidebar" aria-label="OpenCode setting sections">
          {cards.map((card) => (
            <ConfigSettingNavItem
              active={card.title === activeCard.title}
              card={card}
              key={card.title}
              onClick={() => setRequestedActiveTitle(card.title)}
            />
          ))}
        </aside>
        <ConfigSettingDetail
          card={activeCard}
          editable={Boolean(onRequestChange)}
          modelOptions={data.models}
          projectId={data.project.id}
          providers={data.providers}
          values={draftValuesByTitle[activeCard.title] ?? initialDraftValues[activeCard.title] ?? {}}
          onValueChange={(name, value) => updateDraftValue(activeCard.title, name, value)}
        />
      </div>
    </section>
  )
}

function ConfigSettingNavItem({ card, active, onClick }: { card: ConfigSettingCard; active: boolean; onClick: () => void }) {
  const Icon = card.icon
  return (
    <button className={`config-setting-nav-item ${active ? 'active' : ''}`} type="button" onClick={onClick}>
      <span className="config-setting-icon">
        <Icon size={17} />
      </span>
      <span>
        <strong>{card.title}</strong>
        <small>{card.configKey}</small>
      </span>
      <ChevronRight size={15} />
    </button>
  )
}

function ConfigSettingDetail({
  card,
  editable,
  modelOptions,
  projectId,
  providers,
  values,
  onValueChange,
}: {
  card: ConfigSettingCard
  editable: boolean
  modelOptions: string[]
  projectId: string
  providers: ProviderItem[]
  values: ConfigFormValues
  onValueChange: (name: string, value: ConfigFormValue) => void
}) {
  const Icon = card.icon
  return (
    <article className="config-setting-detail">
      <header className="config-setting-detail-header">
        <div className="config-setting-detail-copy">
          <span className="config-setting-icon large">
            <Icon size={20} />
          </span>
          <div>
            <h3>{card.title}</h3>
            <code>{card.configKey}</code>
          </div>
        </div>
        <StatusBadge tone={card.tone} label={card.status} />
      </header>
      <p>{card.detail}</p>
      {editable && (
        <ConfigSettingForm card={card} modelOptions={modelOptions} projectId={projectId} providers={providers} values={values} onValueChange={onValueChange} />
      )}
      <dl className="config-setting-rows">
        {card.rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}

function ConfigSettingForm({
  card,
  modelOptions,
  projectId,
  providers,
  values,
  onValueChange,
}: {
  card: ConfigSettingCard
  modelOptions: string[]
  projectId: string
  providers: ProviderItem[]
  values: ConfigFormValues
  onValueChange: (name: string, value: ConfigFormValue) => void
}) {
  const fields = buildFormFields(card, modelOptions)

  return (
    <div className="config-setting-form">
      <div className={`config-form-grid ${card.title === 'Image attachments' ? 'image-attachment-grid' : ''}`}>
        {fields.map((field) => (
          <ConfigSettingField field={field} key={field.name} projectId={projectId} value={values[field.name] ?? field.value} onChange={onValueChange} />
        ))}
      </div>
      {card.title === 'Formatters' && Boolean(values.formatter_enabled) && (
        <FormatterToggleList values={values} onChange={onValueChange} />
      )}
      {card.title === 'LSP Servers' && Boolean(values.lsp_enabled) && (
        <LspToggleList values={values} onChange={onValueChange} />
      )}
      {card.title === 'Provider' && (
        <ProviderToggleList providers={providers} values={values} onChange={onValueChange} />
      )}
    </div>
  )
}

function ConfigSettingField({
  field,
  projectId,
  value,
  onChange,
}: {
  field: ConfigFormField
  projectId: string
  value: ConfigFormValue
  onChange: (name: string, value: ConfigFormValue) => void
}) {
  if (field.type === 'instruction-picker') {
    return (
      <InstructionFilePicker
        projectId={projectId}
        value={String(value ?? '')}
        onChange={(nextValue) => onChange(field.name, nextValue)}
      />
    )
  }

  if (field.type === 'watcher-ignore') {
    return (
      <WatcherIgnorePicker
        projectId={projectId}
        value={String(value ?? '')}
        onChange={(nextValue) => onChange(field.name, nextValue)}
      />
    )
  }

  if (field.type === 'checkbox') {
    return (
      <label className="config-form-field checkbox-field">
        <span>{field.label}</span>
        <span className="checkbox-toggle">
          <input
            checked={Boolean(value)}
            type="checkbox"
            onChange={(event) => onChange(field.name, event.target.checked)}
          />
          <i aria-hidden="true" />
        </span>
      </label>
    )
  }

  if (field.type === 'textarea' || field.type === 'json') {
    return (
      <label className={`config-form-field ${field.type === 'json' ? 'json-field' : ''}`}>
        <span>{field.label}</span>
        <textarea
          placeholder={field.placeholder}
          value={String(value ?? '')}
          onChange={(event) => onChange(field.name, event.target.value)}
        />
      </label>
    )
  }

  if (field.type === 'typeahead') {
    return (
      <ConfigTypeaheadField
        defaultLabel={field.defaultLabel ?? 'Default'}
        label={field.label}
        options={field.options ?? []}
        placeholder={field.placeholder}
        value={String(value ?? '')}
        onChange={(nextValue) => onChange(field.name, nextValue)}
      />
    )
  }

  return (
    <label className="config-form-field">
      <span>{field.label}</span>
      <input
        placeholder={field.placeholder}
        type={field.type}
        value={String(value ?? '')}
        onChange={(event) => onChange(field.name, event.target.value)}
      />
    </label>
  )
}

function ConfigTypeaheadField({
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
  placeholder?: string
  onChange: (value: string) => void
}) {
  const [queryState, setQueryState] = useState(() => ({ sourceValue: value, query: value || '' }))
  const [open, setOpen] = useState(false)
  const query = queryState.sourceValue === value ? queryState.query : value || ''
  const setQuery = (nextQuery: string) => setQueryState({ sourceValue: value, query: nextQuery })

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
    <label className="config-form-field">
      <span>{label}</span>
      <div className="typeahead-field">
        <input
          aria-expanded={open}
          aria-label={label}
          placeholder={placeholder}
          role="combobox"
          value={query}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onChange={(event) => {
            const nextValue = event.target.value
            setQuery(nextValue)
            onChange(nextValue)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <button
          aria-label={`Use ${defaultLabel}`}
          title={defaultLabel}
          type="button"
          onClick={() => selectValue('')}
          onMouseDown={(event) => event.preventDefault()}
        >
          {value ? 'Reset' : defaultLabel}
        </button>
        {open && (
          <div className="typeahead-menu" role="listbox">
            <button type="button" role="option" onClick={() => selectValue('')} onMouseDown={(event) => event.preventDefault()}>
              {defaultLabel}
            </button>
            {visibleOptions.map((option) => (
              <button type="button" role="option" key={option} onClick={() => selectValue(option)} onMouseDown={(event) => event.preventDefault()}>
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

function WatcherIgnorePicker({
  projectId,
  value,
  onChange,
}: {
  projectId: string
  value: string
  onChange: (value: string) => void
}) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<ProjectPathReference[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const patterns = lineValues(value)

  useEffect(() => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      return
    }

    let active = true
    const timer = window.setTimeout(() => {
      setLoading(true)
      setError(null)
      searchProjectPaths(projectId, trimmedQuery, 30)
        .then((items) => {
          if (!active) return
          setSuggestions(items)
          setOpen(true)
        })
        .catch((caughtError) => {
          if (!active) return
          setSuggestions([])
          setError(caughtError instanceof Error ? caughtError.message : 'Unable to search project paths')
        })
        .finally(() => {
          if (active) setLoading(false)
        })
    }, 180)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [projectId, query])

  const addPattern = (pattern: string) => {
    const normalized = pattern.trim().replace(/\\/g, '/')
    if (!normalized) return
    onChange([...new Set([...patterns, normalized])].join('\n'))
    setQuery('')
    setSuggestions([])
    setOpen(false)
  }

  const addSuggestion = (item: ProjectPathReference) => {
    addPattern(item.type === 'directory' ? `${item.path.replace(/\/$/, '')}/**` : item.path)
  }

  const removePattern = (pattern: string) => {
    onChange(patterns.filter((item) => item !== pattern).join('\n'))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (open && suggestions.length > 0) {
        addSuggestion(suggestions[0])
        return
      }
      addPattern(query)
    }
    if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <section className="watcher-ignore-field">
      <div className="watcher-ignore-header">
        <span>Folder / file</span>
        <div className="watcher-ignore-add">
          <div className="watcher-ignore-typeahead">
            <input
              aria-expanded={open}
              aria-label="Folder or file to ignore"
              placeholder="Type folder or file name"
              role="combobox"
              value={query}
              onBlur={() => window.setTimeout(() => setOpen(false), 120)}
              onChange={(event) => {
                setQuery(event.target.value)
                setError(null)
                setOpen(true)
              }}
              onFocus={() => {
                if (query.trim()) setOpen(true)
              }}
              onKeyDown={handleKeyDown}
            />
            {open && query.trim() && (
              <div className="typeahead-menu watcher-ignore-menu" role="listbox">
                {suggestions.map((item) => (
                  <button
                    key={`${item.type}:${item.path}`}
                    type="button"
                    role="option"
                    onClick={() => addSuggestion(item)}
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    <strong>{item.name}</strong>
                    <small>{item.type} - {item.path}</small>
                  </button>
                ))}
                {!loading && suggestions.length === 0 && <span>No matching folder or file</span>}
                {loading && <span>Searching...</span>}
              </div>
            )}
          </div>
          <button className="toolbar-button accent" type="button" onClick={() => addPattern(query)}>
            <Plus size={15} />
            <span>Add ignore</span>
          </button>
        </div>
      </div>
      <div className="ignore-pattern-list" aria-label="Ignored folders and files">
        {patterns.length === 0 ? (
          <p>No ignored folders or files.</p>
        ) : (
          patterns.map((pattern) => (
            <div className="ignore-pattern-row" key={pattern}>
              <code>{pattern}</code>
              <button type="button" aria-label={`Delete ${pattern}`} onClick={() => removePattern(pattern)}>
                <Trash2 size={15} />
                <span>Delete</span>
              </button>
            </div>
          ))
        )}
      </div>
      {query.trim() && error && <div className="config-form-error">{error}</div>}
    </section>
  )
}

function FormatterToggleList({
  values,
  onChange,
}: {
  values: ConfigFormValues
  onChange: (name: string, value: ConfigFormValue) => void
}) {
  return (
    <section className="formatter-toggle-section">
      <div>
        <strong>Built-in formatters</strong>
        <span>Tick a formatter to disable it individually.</span>
      </div>
      <div className="formatter-toggle-list">
        {BUILT_IN_FORMATTERS.map((formatter) => {
          const fieldName = formatterDisabledKey(formatter.name)
          return (
            <label className="formatter-toggle-row" key={formatter.name}>
              <span>
                <strong>{formatter.name}</strong>
                <small>{formatter.extensions.join(', ')}</small>
              </span>
              <em>{formatter.requirement}</em>
              <span className="formatter-toggle-control">
                Disabled
                <input
                  checked={Boolean(values[fieldName])}
                  type="checkbox"
                  onChange={(event) => onChange(fieldName, event.target.checked)}
                />
              </span>
            </label>
          )
        })}
      </div>
    </section>
  )
}

function InstructionFilePicker({
  projectId,
  value,
  onChange,
}: {
  projectId: string
  value: string
  onChange: (value: string) => void
}) {
  const [pickerError, setPickerError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const paths = lineValues(value)

  const handleSelectedFiles = async (files: File[]) => {
    if (files.length === 0) return
    const unsupportedFile = files.find((file) => !/\.(md|txt)$/i.test(file.name))
    if (unsupportedFile) {
      setPickerError('Only .md and .txt instruction files are allowed')
      return
    }

    setUploading(true)
    setPickerError(null)
    try {
      const result = await uploadInstructionFiles(projectId, files)
      if (result.paths.length === 0) return
      onChange([...new Set([...paths, ...result.paths])].join('\n'))
    } catch (error) {
      setPickerError(error instanceof Error ? error.message : 'Unable to upload instruction files')
    } finally {
      setUploading(false)
    }
  }

  const removePath = (pathToRemove: string) => {
    onChange(paths.filter((path) => path !== pathToRemove).join('\n'))
  }

  return (
    <section className="instruction-picker-field">
      <div className="instruction-picker-header">
        <span>Instruction files</span>
        <label className={`toolbar-button instruction-file-button ${uploading ? 'disabled' : ''}`}>
          <FolderOpen size={16} />
          <span>{uploading ? 'Uploading...' : 'Choose .md / .txt files'}</span>
          <input
            accept=".md,.txt,text/markdown,text/plain"
            disabled={uploading}
            multiple
            type="file"
            onChange={(event) => {
              void handleSelectedFiles(Array.from(event.target.files ?? []))
              event.target.value = ''
            }}
          />
        </label>
      </div>
      {paths.length === 0 ? (
        <p>No instruction files selected.</p>
      ) : (
        <div className="instruction-file-list">
          {paths.map((filePath) => (
            <div className="instruction-file-row" key={filePath}>
              <code>{filePath}</code>
              <button type="button" aria-label={`Remove ${filePath}`} onClick={() => removePath(filePath)}>
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
      {pickerError && <div className="config-form-error">{pickerError}</div>}
    </section>
  )
}

function LspToggleList({
  values,
  onChange,
}: {
  values: ConfigFormValues
  onChange: (name: string, value: ConfigFormValue) => void
}) {
  return (
    <section className="lsp-toggle-section">
      <div>
        <strong>Built-in LSP servers</strong>
        <span>Tick an LSP server to disable it individually.</span>
      </div>
      <div className="lsp-toggle-list">
        {BUILT_IN_LSP_SERVERS.map((server) => {
          const fieldName = lspDisabledKey(server.name)
          return (
            <label className="lsp-toggle-row" key={server.name}>
              <span>
                <strong>{server.name}</strong>
                <small>{server.extensions.join(', ')}</small>
              </span>
              <em>{server.requirement}</em>
              <span className="lsp-toggle-control">
                Disabled
                <input
                  checked={Boolean(values[fieldName])}
                  type="checkbox"
                  onChange={(event) => onChange(fieldName, event.target.checked)}
                />
              </span>
            </label>
          )
        })}
      </div>
    </section>
  )
}

function ProviderToggleList({
  providers,
  values,
  onChange,
}: {
  providers: ProviderItem[]
  values: ConfigFormValues
  onChange: (name: string, value: ConfigFormValue) => void
}) {
  return (
    <section className="provider-toggle-section">
      <div>
        <strong>Providers</strong>
        <span>Tick a provider to add it to disabled_providers.</span>
      </div>
      {providers.length === 0 ? (
        <p>OpenCode did not return any providers.</p>
      ) : (
        <div className="provider-toggle-list">
          {providers.map((provider) => {
            const fieldName = providerDisabledKey(provider.id)
            return (
              <label className="provider-toggle-row" key={provider.id}>
                <span>
                  <strong>{provider.name}</strong>
                  <small>{provider.id}</small>
                </span>
                <em>{provider.source}</em>
                <span className="provider-toggle-control">
                  Disabled
                  <input
                    checked={Boolean(values[fieldName])}
                    type="checkbox"
                    onChange={(event) => onChange(fieldName, event.target.checked)}
                  />
                </span>
              </label>
            )
          })}
        </div>
      )}
    </section>
  )
}

function fileName(filePath: string) {
  return filePath.split(/[\\/]/).pop() ?? filePath
}
