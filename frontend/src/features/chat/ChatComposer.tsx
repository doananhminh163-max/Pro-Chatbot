import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { AtSign, Bot, Check, ChevronDown, Command, Cpu, FileText, Send, Square } from 'lucide-react'
import type { AgentItem, ChatFileReference, ChatSubmitOptions, CommandItem, SkillItem } from '../../types/appData'
import { fuzzyMatch } from '../../utils/fuzzyMatch'

type SlashItem = {
  kind: 'command' | 'skill'
  name: string
  description: string
  source: string
}

type ActiveToken = {
  marker: '/' | '$' | '@'
  query: string
  start: number
  end: number
}

function activeToken(textarea: HTMLTextAreaElement | null): ActiveToken | null {
  if (!textarea) return null
  const cursor = textarea.selectionStart
  const beforeCursor = textarea.value.slice(0, cursor)
  const match = beforeCursor.match(/(^|\s)([/$@])([^\s]*)$/)
  if (!match || match.index === undefined) return null
  const marker = match[2] as ActiveToken['marker']
  const prefixLength = match[1].length
  return {
    marker,
    query: match[3],
    start: match.index + prefixLength,
    end: cursor,
  }
}

function replaceActiveToken(text: string, token: ActiveToken, replacement: string) {
  return `${text.slice(0, token.start)}${replacement}${text.slice(token.end)}`
}

function shortModelName(model: string) {
  if (!model) return 'Default model'
  const [, ...rest] = model.split('/')
  return rest.join('/') || model
}

function uniqueFiles(files: ChatFileReference[]) {
  const seen = new Set<string>()
  return files.filter((file) => {
    const key = file.path.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function parseChatOptions(message: string, commands: CommandItem[], skills: SkillItem[]) {
  const trimmed = message.trimStart()
  const marker = trimmed[0]
  if (marker !== '/' && marker !== '$') return {}

  const match = trimmed.match(/^[/$]([a-zA-Z0-9_.-]+)(?:\s+([\s\S]*))?$/)
  if (!match) return {}
  const name = match[1]
  const rest = match[2]?.trim() ?? ''

  if (marker === '/' && new Set(commands.map((command) => command.name)).has(name)) {
    return { command: name, arguments: rest }
  }
  if (marker === '$' && new Set(skills.map((skill) => skill.name)).has(name)) {
    return { skills: [name] }
  }
  return {}
}

export function ChatComposer({
  projectId,
  models,
  agents,
  commands,
  skills,
  selectedModel,
  selectedAgent,
  onSelectedModelChange,
  onSelectedAgentChange,
  onSearchFiles,
  onSubmitMessage,
  streaming = false,
  onCancelStreaming,
}: {
  projectId: string | undefined
  models: string[]
  agents: AgentItem[]
  commands: CommandItem[]
  skills: SkillItem[]
  selectedModel: string
  selectedAgent: string
  onSelectedModelChange: (model: string) => void
  onSelectedAgentChange: (agent: string) => void
  onSearchFiles: (query: string) => Promise<ChatFileReference[]>
  onSubmitMessage: (message: string, options: ChatSubmitOptions) => Promise<void>
  streaming?: boolean
  onCancelStreaming?: () => void
}) {
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [activeMenu, setActiveMenu] = useState<'model' | 'agent' | null>(null)
  const [token, setToken] = useState<ActiveToken | null>(null)
  const [fileResults, setFileResults] = useState<ChatFileReference[]>([])
  const [selectedFiles, setSelectedFiles] = useState<ChatFileReference[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [modelQuery, setModelQuery] = useState('')
  const [agentQuery, setAgentQuery] = useState('')
  const formRef = useRef<HTMLFormElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const modelSearchRef = useRef<HTMLInputElement | null>(null)
  const agentSearchRef = useRef<HTMLInputElement | null>(null)

  const commandItems = useMemo<SlashItem[]>(() => (
    commands.map((command) => ({
      kind: 'command' as const,
      name: command.name,
      description: command.description || 'OpenCode command',
      source: command.source,
    }))
  ), [commands])

  const skillItems = useMemo<SlashItem[]>(() => (
    skills.map((skill) => ({
      kind: 'skill' as const,
      name: skill.name,
      description: skill.description || 'OpenCode skill',
      source: skill.scope,
    }))
  ), [skills])

  const visibleSlashItems = useMemo(() => {
    if (token?.marker !== '/' && token?.marker !== '$') return []
    const query = token.query
    const items = token.marker === '/' ? commandItems : skillItems
    return items
      .filter((item) => fuzzyMatch(item.name, query) || fuzzyMatch(item.description, query))
  }, [commandItems, skillItems, token])
  const selectableAgents = useMemo(() => agents.filter((agent) => agent.mode !== 'system'), [agents])
  const slashOpen = (token?.marker === '/' || token?.marker === '$') && visibleSlashItems.length > 0
  const fileOpen = token?.marker === '@' && fileResults.length > 0
  const paletteOpen = slashOpen || fileOpen

  const filteredModels = useMemo(() => {
    if (!modelQuery) return models
    return models.filter((model) => fuzzyMatch(model, modelQuery) || fuzzyMatch(shortModelName(model), modelQuery))
  }, [modelQuery, models])

  const filteredAgents = useMemo(() => {
    if (!agentQuery) return selectableAgents
    return selectableAgents.filter((agent) => (
      fuzzyMatch(agent.name, agentQuery)
      || fuzzyMatch(agent.mode, agentQuery)
      || fuzzyMatch(agent.description, agentQuery)
    ))
  }, [agentQuery, selectableAgents])

  useEffect(() => {
    if (activeMenu === 'model') {
      modelSearchRef.current?.focus()
    }
    if (activeMenu === 'agent') {
      agentSearchRef.current?.focus()
    }
  }, [activeMenu])

  useEffect(() => {
    if (token?.marker !== '@' || !projectId) {
      return
    }

    let active = true
    const timeout = window.setTimeout(() => {
      void onSearchFiles(token.query).then((results) => {
        if (active) setFileResults(results.slice(0, 9))
      }).catch(() => {
        if (active) setFileResults([])
      })
    }, 120)

    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [onSearchFiles, projectId, token])

  useLayoutEffect(() => {
    if (!paletteOpen) return

    const updatePaletteHeight = () => {
      const form = formRef.current
      if (!form) return

      const rootStyles = window.getComputedStyle(document.documentElement)
      const headerBottom = document.querySelector('.main-header')?.getBoundingClientRect().bottom
      const fallbackHeaderHeight = Number.parseFloat(rootStyles.getPropertyValue('--header-height'))
      const headerHeight = headerBottom ?? (Number.isFinite(fallbackHeaderHeight) ? fallbackHeaderHeight : 74)
      const formTop = form.getBoundingClientRect().top
      const availableAboveComposer = Math.floor(formTop - headerHeight - 18)
      const viewportLimit = Math.floor(window.innerHeight - headerHeight - 160)
      const maxHeight = Math.max(96, Math.min(420, availableAboveComposer, viewportLimit))
      form.style.setProperty('--composer-palette-max-height', `${maxHeight}px`)
    }

    updatePaletteHeight()
    const observer = new ResizeObserver(updatePaletteHeight)
    if (formRef.current) observer.observe(formRef.current)
    window.addEventListener('resize', updatePaletteHeight)
    window.addEventListener('scroll', updatePaletteHeight, true)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updatePaletteHeight)
      window.removeEventListener('scroll', updatePaletteHeight, true)
    }
  }, [paletteOpen, visibleSlashItems.length, fileResults.length])

  useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    const scrollHeight = textarea.scrollHeight
    const maxAllowedHeight = 64 // 2x the base min-height of 32px

    if (scrollHeight > maxAllowedHeight) {
      textarea.style.height = `${maxAllowedHeight}px`
      textarea.style.overflowY = 'auto'
    } else {
      textarea.style.height = `${scrollHeight}px`
      textarea.style.overflowY = 'hidden'
    }
  }, [message])

  const refreshActiveToken = () => {
    window.requestAnimationFrame(() => {
      const nextToken = activeToken(textareaRef.current)
      setToken(nextToken)
      setHighlightedIndex(0)
      if (nextToken?.marker !== '@') {
        setFileResults([])
      }
    })
  }

  const toggleMenu = (menu: 'model' | 'agent') => {
    const nextMenu = activeMenu === menu ? null : menu
    setActiveMenu(nextMenu)
    if (nextMenu === 'model') setModelQuery('')
    if (nextMenu === 'agent') setAgentQuery('')
  }

  const handleTypeaheadKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setActiveMenu(null)
      textareaRef.current?.focus()
    }
  }

  const selectSlashItem = (item: SlashItem) => {
    if (!token || (token.marker !== '/' && token.marker !== '$')) return
    const marker = item.kind === 'skill' ? '$' : '/'
    const nextMessage = replaceActiveToken(message, token, `${marker}${item.name} `)
    setMessage(nextMessage)
    setToken(null)
    textareaRef.current?.focus()
  }

  const selectFile = (file: ChatFileReference) => {
    if (!token || token.marker !== '@') return
    const nextMessage = replaceActiveToken(message, token, `@${file.path} `)
    setMessage(nextMessage)
    setSelectedFiles((current) => uniqueFiles([...current, file]))
    setToken(null)
    textareaRef.current?.focus()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = message.trim()
    if (!trimmed || submitting) return

    const slashOptions = parseChatOptions(trimmed, commands, skills)
    const options: ChatSubmitOptions = {
      ...slashOptions,
      agent: selectedAgent || undefined,
      model: selectedModel || undefined,
      files: selectedFiles.length > 0 ? selectedFiles : undefined,
    }

    setSubmitting(true)
    setMessage('')
    setSelectedFiles([])
    setToken(null)
    try {
      await onSubmitMessage(trimmed, options)
    } catch (error) {
      setMessage(trimmed)
      setSelectedFiles(options.files ?? [])
      throw error
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const activeItems = slashOpen ? visibleSlashItems : fileOpen ? fileResults : []

    if (activeItems.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setHighlightedIndex((index) => (index + 1) % activeItems.length)
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setHighlightedIndex((index) => (index - 1 + activeItems.length) % activeItems.length)
        return
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault()
        if (slashOpen) {
          selectSlashItem(visibleSlashItems[Math.min(highlightedIndex, visibleSlashItems.length - 1)])
        } else if (fileOpen) {
          selectFile(fileResults[Math.min(highlightedIndex, fileResults.length - 1)])
        }
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        setToken(null)
        return
      }
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <form ref={formRef} className="chat-composer" onSubmit={handleSubmit}>
      <div className="composer-toolbar" aria-label="OpenCode controls">
        <div className="composer-menu-wrap">
          <button className="composer-control-button" type="button" onClick={() => toggleMenu('model')}>
            <Cpu size={15} />
            <span>{shortModelName(selectedModel)}</span>
            <ChevronDown size={14} />
          </button>
          {activeMenu === 'model' && (
            <div className="composer-dropdown" role="listbox" aria-label="Model">
              <input
                ref={modelSearchRef}
                className="composer-typeahead"
                type="search"
                placeholder="Filter models..."
                value={modelQuery}
                onChange={(event) => setModelQuery(event.target.value)}
                onKeyDown={handleTypeaheadKeyDown}
              />
              <button type="button" className={!selectedModel ? 'active' : ''} onClick={() => { onSelectedModelChange(''); setActiveMenu(null) }}>
                {!selectedModel && <Check size={14} />}
                <span>Default model</span>
              </button>
              {filteredModels.map((model) => (
                <button key={model} type="button" className={selectedModel === model ? 'active' : ''} onClick={() => { onSelectedModelChange(model); setActiveMenu(null) }}>
                  {selectedModel === model && <Check size={14} />}
                  <span>{model}</span>
                </button>
              ))}
              {filteredModels.length === 0 && <p className="composer-empty-result">No models found</p>}
            </div>
          )}
        </div>

        <div className="composer-menu-wrap">
          <button className="composer-control-button" type="button" onClick={() => toggleMenu('agent')}>
            <Bot size={15} />
            <span>{selectedAgent || 'Default agent'}</span>
            <ChevronDown size={14} />
          </button>
          {activeMenu === 'agent' && (
            <div className="composer-dropdown" role="listbox" aria-label="Agent">
              <input
                ref={agentSearchRef}
                className="composer-typeahead"
                type="search"
                placeholder="Filter agents..."
                value={agentQuery}
                onChange={(event) => setAgentQuery(event.target.value)}
                onKeyDown={handleTypeaheadKeyDown}
              />
              <button type="button" className={!selectedAgent ? 'active' : ''} onClick={() => { onSelectedAgentChange(''); setActiveMenu(null) }}>
                {!selectedAgent && <Check size={14} />}
                <span>Default agent</span>
              </button>
              {filteredAgents.map((agent) => (
                <button key={agent.name} type="button" className={selectedAgent === agent.name ? 'active' : ''} onClick={() => { onSelectedAgentChange(agent.name); setActiveMenu(null) }}>
                  {selectedAgent === agent.name && <Check size={14} />}
                  <span>{agent.name}</span>
                  <small>{agent.mode}</small>
                </button>
              ))}
              {filteredAgents.length === 0 && <p className="composer-empty-result">No agents found</p>}
            </div>
          )}
        </div>
      </div>

      <div className="composer-input-row">
        <label className="sr-only" htmlFor="composer-input">
          Ask Pro Chatbot
        </label>
        <textarea
          id="composer-input"
          ref={textareaRef}
          placeholder="Ask OpenCode...  / for commands, $ for skills, @ for files"
          rows={1}
          value={message}
          onBlur={(event) => {
            const nextFocus = event.relatedTarget
            if (nextFocus instanceof Node && event.currentTarget.form?.contains(nextFocus)) return
            window.setTimeout(() => setActiveMenu(null), 120)
          }}
          onChange={(event) => {
            setMessage(event.target.value)
            refreshActiveToken()
          }}
          onClick={refreshActiveToken}
          onKeyUp={refreshActiveToken}
          onKeyDown={handleKeyDown}
        />
        {streaming ? (
          <button className="composer-send stop" type="button" aria-label="Stop streaming" onClick={onCancelStreaming}>
            <Square size={17} fill="currentColor" />
          </button>
        ) : (
          <button className="composer-send" type="submit" aria-label="Send" disabled={submitting || !message.trim()}>
            <Send size={19} />
          </button>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="composer-context-chips" aria-label="Attached files">
          {selectedFiles.map((file) => (
            <button key={file.path} type="button" onClick={() => setSelectedFiles((current) => current.filter((item) => item.path !== file.path))}>
              <FileText size={13} />
              <span>{file.path}</span>
            </button>
          ))}
        </div>
      )}

      {(token?.marker === '/' || token?.marker === '$') && visibleSlashItems.length > 0 && (
        <div className="composer-palette" role="listbox" aria-label={token.marker === '$' ? 'Skills' : 'Commands'}>
          {visibleSlashItems.map((item, index) => (
            <button key={`${item.kind}-${item.name}`} type="button" className={index === highlightedIndex ? 'active' : ''} onMouseDown={(event) => event.preventDefault()} onClick={() => selectSlashItem(item)}>
              {item.kind === 'command' ? <Command size={15} /> : <Bot size={15} />}
              <span>
                <strong>{item.kind === 'skill' ? '$' : '/'}{item.name}</strong>
                <small>{item.description}</small>
              </span>
              <em>{item.kind}</em>
            </button>
          ))}
        </div>
      )}

      {token?.marker === '@' && fileResults.length > 0 && (
        <div className="composer-palette" role="listbox" aria-label="Files">
          {fileResults.map((file, index) => (
            <button key={file.path} type="button" className={index === highlightedIndex ? 'active' : ''} onMouseDown={(event) => event.preventDefault()} onClick={() => selectFile(file)}>
              <AtSign size={15} />
              <span>
                <strong>{file.path}</strong>
                <small>{file.mime ?? 'workspace file'}</small>
              </span>
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
