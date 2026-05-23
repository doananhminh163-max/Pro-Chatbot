import {
  Camera,
  Code2,
  FileText,
  HardDrive,
  Image,
  MonitorCog,
  Server,
  Settings2,
  Sparkles,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { ProviderItem, StatusTone } from '../../types/appData'

export type ConfigRecord = Record<string, unknown>

export type BuiltInFormatter = {
  name: string
  extensions: string[]
  requirement: string
}

export type BuiltInLspServer = {
  name: string
  extensions: string[]
  requirement: string
}

export type ConfigSettingCard = {
  title: string
  configKey: string
  icon: LucideIcon
  tone: StatusTone
  status: string
  detail: string
  rows: Array<{ label: string; value: string }>
  patch: Record<string, unknown>
}

export type ConfigFormValue = string | boolean
export type ConfigFormValues = Record<string, ConfigFormValue>
export type ConfigFormField = {
  name: string
  label: string
  type: 'text' | 'number' | 'textarea' | 'checkbox' | 'json' | 'typeahead' | 'instruction-picker' | 'watcher-ignore'
  value: ConfigFormValue
  placeholder?: string
  options?: string[]
  defaultLabel?: string
}

export const BUILT_IN_FORMATTERS: BuiltInFormatter[] = [
  { name: 'air', extensions: ['.R'], requirement: 'air command available' },
  { name: 'biome', extensions: ['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.md', '.json', '.yaml', 'and more'], requirement: 'biome.json(c) config file' },
  { name: 'cargofmt', extensions: ['.rs'], requirement: 'cargo fmt command available' },
  { name: 'clang-format', extensions: ['.c', '.cpp', '.h', '.hpp', '.ino', 'and more'], requirement: '.clang-format config file' },
  { name: 'cljfmt', extensions: ['.clj', '.cljs', '.cljc', '.edn'], requirement: 'cljfmt command available' },
  { name: 'dart', extensions: ['.dart'], requirement: 'dart command available' },
  { name: 'dfmt', extensions: ['.d'], requirement: 'dfmt command available' },
  { name: 'gleam', extensions: ['.gleam'], requirement: 'gleam command available' },
  { name: 'gofmt', extensions: ['.go'], requirement: 'gofmt command available' },
  { name: 'htmlbeautifier', extensions: ['.erb', '.html.erb'], requirement: 'htmlbeautifier command available' },
  { name: 'ktlint', extensions: ['.kt', '.kts'], requirement: 'ktlint command available' },
  { name: 'mix', extensions: ['.ex', '.exs', '.eex', '.heex', '.leex', '.neex', '.sface'], requirement: 'mix command available' },
  { name: 'nixfmt', extensions: ['.nix'], requirement: 'nixfmt command available' },
  { name: 'ocamlformat', extensions: ['.ml', '.mli'], requirement: 'ocamlformat command available and .ocamlformat config file' },
  { name: 'ormolu', extensions: ['.hs'], requirement: 'ormolu command available' },
  { name: 'oxfmt', extensions: ['.js', '.jsx', '.ts', '.tsx'], requirement: 'Experimental: oxfmt dependency and env flag' },
  { name: 'pint', extensions: ['.php'], requirement: 'laravel/pint dependency in composer.json' },
  { name: 'prettier', extensions: ['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.md', '.json', '.yaml', 'and more'], requirement: 'prettier dependency in package.json' },
  { name: 'rubocop', extensions: ['.rb', '.rake', '.gemspec', '.ru'], requirement: 'rubocop command available' },
  { name: 'ruff', extensions: ['.py', '.pyi'], requirement: 'ruff command available with config' },
  { name: 'rustfmt', extensions: ['.rs'], requirement: 'rustfmt command available' },
  { name: 'shfmt', extensions: ['.sh', '.bash'], requirement: 'shfmt command available' },
  { name: 'standardrb', extensions: ['.rb', '.rake', '.gemspec', '.ru'], requirement: 'standardrb command available' },
  { name: 'terraform', extensions: ['.tf', '.tfvars'], requirement: 'terraform command available' },
  { name: 'uv', extensions: ['.py', '.pyi'], requirement: 'uv command available' },
  { name: 'zig', extensions: ['.zig', '.zon'], requirement: 'zig command available' },
]

export const BUILT_IN_LSP_SERVERS: BuiltInLspServer[] = [
  { name: 'astro', extensions: ['.astro'], requirement: 'Auto-installs for Astro projects' },
  { name: 'bash', extensions: ['.sh', '.bash', '.zsh', '.ksh'], requirement: 'Auto-installs bash-language-server' },
  { name: 'clangd', extensions: ['.c', '.cpp', '.cc', '.cxx', '.c++', '.h', '.hpp', '.hh', '.hxx', '.h++'], requirement: 'Auto-installs for C/C++ projects' },
  { name: 'csharp', extensions: ['.cs', '.csx'], requirement: '.NET SDK installed' },
  { name: 'clojure-lsp', extensions: ['.clj', '.cljs', '.cljc', '.edn'], requirement: 'clojure-lsp command available' },
  { name: 'dart', extensions: ['.dart'], requirement: 'dart command available' },
  { name: 'deno', extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'], requirement: 'deno command available; auto-detects deno.json' },
  { name: 'elixir-ls', extensions: ['.ex', '.exs'], requirement: 'elixir command available' },
  { name: 'eslint', extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts', '.vue'], requirement: 'eslint dependency in project' },
  { name: 'fsharp', extensions: ['.fs', '.fsi', '.fsx', '.fsscript'], requirement: '.NET SDK installed' },
  { name: 'gleam', extensions: ['.gleam'], requirement: 'gleam command available' },
  { name: 'gopls', extensions: ['.go'], requirement: 'go command available' },
  { name: 'hls', extensions: ['.hs', '.lhs'], requirement: 'haskell-language-server-wrapper command available' },
  { name: 'jdtls', extensions: ['.java'], requirement: 'Java SDK 21+ installed' },
  { name: 'julials', extensions: ['.jl'], requirement: 'julia and LanguageServer.jl installed' },
  { name: 'kotlin-ls', extensions: ['.kt', '.kts'], requirement: 'Auto-installs for Kotlin projects' },
  { name: 'lua-ls', extensions: ['.lua'], requirement: 'Auto-installs for Lua projects' },
  { name: 'nixd', extensions: ['.nix'], requirement: 'nixd command available' },
  { name: 'ocaml-lsp', extensions: ['.ml', '.mli'], requirement: 'ocamllsp command available' },
  { name: 'oxlint', extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts', '.vue', '.astro', '.svelte'], requirement: 'oxlint dependency in project' },
  { name: 'php intelephense', extensions: ['.php'], requirement: 'Auto-installs for PHP projects' },
  { name: 'prisma', extensions: ['.prisma'], requirement: 'prisma command available' },
  { name: 'pyright', extensions: ['.py', '.pyi'], requirement: 'pyright dependency installed' },
  { name: 'razor', extensions: ['.razor', '.cshtml'], requirement: '.NET SDK and VS Code C# extension installed' },
  { name: 'ruby-lsp (rubocop)', extensions: ['.rb', '.rake', '.gemspec', '.ru'], requirement: 'ruby and gem commands available' },
  { name: 'rust', extensions: ['.rs'], requirement: 'rust-analyzer command available' },
  { name: 'sourcekit-lsp', extensions: ['.swift', '.objc', '.objcpp'], requirement: 'swift installed; xcode on macOS' },
  { name: 'svelte', extensions: ['.svelte'], requirement: 'Auto-installs for Svelte projects' },
  { name: 'terraform', extensions: ['.tf', '.tfvars'], requirement: 'Auto-installs from GitHub releases' },
  { name: 'tinymist', extensions: ['.typ', '.typc'], requirement: 'Auto-installs from GitHub releases' },
  { name: 'typescript', extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts'], requirement: 'typescript dependency in project' },
  { name: 'vue', extensions: ['.vue'], requirement: 'Auto-installs for Vue projects' },
  { name: 'yaml-ls', extensions: ['.yaml', '.yml'], requirement: 'Auto-installs Red Hat yaml-language-server' },
  { name: 'zls', extensions: ['.zig', '.zon'], requirement: 'zig command available' },
]

export function buildFormFields(card: ConfigSettingCard, modelOptions: string[] = []): ConfigFormField[] {
  const patch = card.patch
  if (card.title === 'Server') {
    const server = objectValue(patch.server) ?? {}
    return [
      { name: 'hostname', label: 'Hostname', type: 'text', value: stringValue(server.hostname, '127.0.0.1') },
      { name: 'port', label: 'Port', type: 'number', value: stringValue(server.port, '4097') },
      { name: 'cors', label: 'CORS origins', type: 'textarea', value: linesFromUnknown(server.cors), placeholder: 'http://localhost:5173' },
    ]
  }

  if (card.title === 'Tools') {
    return [
      { name: 'tools', label: 'Tools JSON', type: 'json', value: stringifyJson(patch.tools ?? {}), placeholder: '{\n  "bash": false\n}' },
    ]
  }

  if (card.title === 'Models') {
    return [
      { name: 'model', label: 'Model', type: 'typeahead', value: stringValue(patch.model, ''), options: modelOptions, defaultLabel: 'OpenCode runtime default', placeholder: 'Type model name' },
      { name: 'small_model', label: 'Small model', type: 'typeahead', value: stringValue(patch.small_model, ''), options: modelOptions, defaultLabel: 'OpenCode runtime default', placeholder: 'Type model name' },
    ]
  }

  if (card.title === 'Image attachments') {
    const attachment = objectValue(patch.attachment)
    const image = objectValue(attachment?.image) ?? {}
    return [
      { name: 'auto_resize', label: 'Auto resize', type: 'checkbox', value: image.auto_resize !== false },
      { name: 'max_width', label: 'Max width', type: 'number', value: stringValue(image.max_width, '') },
      { name: 'max_height', label: 'Max height', type: 'number', value: stringValue(image.max_height, '') },
      { name: 'max_base64_bytes', label: 'Max base64 bytes', type: 'number', value: stringValue(image.max_base64_bytes, '') },
    ]
  }

  if (card.title === 'Snapshot') return [{ name: 'snapshot', label: 'Snapshot enabled', type: 'checkbox', value: patch.snapshot !== false }]
  if (card.title === 'Formatters') return [{ name: 'formatter_enabled', label: 'Formatter enabled', type: 'checkbox', value: formatterEnabled(patch.formatter) }]
  if (card.title === 'LSP Servers') return [{ name: 'lsp_enabled', label: 'LSP enabled', type: 'checkbox', value: lspEnabled(patch.lsp) }]

  if (card.title === 'Watcher') {
    const watcher = objectValue(patch.watcher) ?? {}
    return [{ name: 'ignore', label: 'Ignore patterns', type: 'watcher-ignore', value: linesFromUnknown(watcher.ignore), placeholder: 'Type folder or file name' }]
  }

  if (card.title === 'Instructions') return [{ name: 'instructions', label: 'Instruction files', type: 'instruction-picker', value: linesFromUnknown(patch.instructions) }]
  if (card.title === 'Provider') return []

  return [
    { name: 'provider', label: 'Provider JSON', type: 'json', value: stringifyJson(patch.provider ?? {}), placeholder: '{\n  "openai": {}\n}' },
    { name: 'enabled_providers', label: 'Enabled providers', type: 'textarea', value: linesFromUnknown(patch.enabled_providers), placeholder: 'anthropic\nopenai' },
    { name: 'disabled_providers', label: 'Disabled providers', type: 'textarea', value: linesFromUnknown(patch.disabled_providers), placeholder: 'gemini' },
  ]
}

function initialFormValues(card: ConfigSettingCard, providers: ProviderItem[] = []): ConfigFormValues {
  return {
    ...Object.fromEntries(buildFormFields(card).map((field) => [field.name, field.value])),
    ...formatterDisabledValues(card.patch.formatter),
    ...lspDisabledValues(card.patch.lsp),
    ...providerDisabledValues(card.patch.disabled_providers, providers),
  }
}

export function buildDraftValues(cards: ConfigSettingCard[], providers: ProviderItem[]) {
  return Object.fromEntries(cards.map((card) => [card.title, initialFormValues(card, providers)]))
}

export function formValuesEqual(left: ConfigFormValues, right: ConfigFormValues) {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)])
  return [...keys].every((key) => left[key] === right[key])
}

export function mergeConfigPatch(base: Record<string, unknown>, patch: Record<string, unknown>): Record<string, unknown> {
  const next = { ...base }
  Object.entries(patch).forEach(([key, value]) => {
    const currentValue = objectValue(next[key])
    const nextValue = objectValue(value)
    next[key] = currentValue && nextValue
      ? mergeConfigPatch(currentValue, nextValue)
      : value
  })
  return next
}

export function buildPatchFromForm(card: ConfigSettingCard, values: ConfigFormValues, providers: ProviderItem[] = []): Record<string, unknown> {
  const title = card.title
  if (title === 'Server') {
    return { server: removeEmptyObjectValues({ hostname: textValue(values.hostname) || undefined, port: numberValue(values.port), cors: lineValues(values.cors) }) }
  }
  if (title === 'Tools') return { tools: parseJsonObject(values.tools, 'Tools JSON') }
  if (title === 'Models') return removeEmptyObjectValues({ model: textValue(values.model) || undefined, small_model: textValue(values.small_model) || undefined })
  if (title === 'Image attachments') {
    return {
      attachment: {
        image: removeEmptyObjectValues({
          auto_resize: Boolean(values.auto_resize),
          max_width: numberValue(values.max_width),
          max_height: numberValue(values.max_height),
          max_base64_bytes: numberValue(values.max_base64_bytes),
        }),
      },
    }
  }
  if (title === 'Snapshot') return { snapshot: Boolean(values.snapshot) }
  if (title === 'Formatters') {
    if (!values.formatter_enabled) return { formatter: false }
    const currentFormatterConfig = objectValue(card.patch.formatter) ?? {}
    const formatterConfig = Object.fromEntries(Object.entries(currentFormatterConfig).map(([name, value]) => {
      const formatterOverride = objectValue(value)
      return [name, formatterOverride ? { ...formatterOverride } : value]
    })) as Record<string, unknown>

    BUILT_IN_FORMATTERS.forEach((formatter) => {
      const currentOverride = objectValue(formatterConfig[formatter.name]) ?? {}
      const disabled = Boolean(values[formatterDisabledKey(formatter.name)])
      if (disabled) {
        formatterConfig[formatter.name] = { ...currentOverride, disabled: true }
        return
      }
      if (objectValue(formatterConfig[formatter.name])) {
        const nextOverride = { ...currentOverride }
        delete nextOverride.disabled
        if (Object.keys(nextOverride).length > 0) formatterConfig[formatter.name] = nextOverride
        else delete formatterConfig[formatter.name]
      }
    })
    return { formatter: Object.keys(formatterConfig).length > 0 ? formatterConfig : true }
  }
  if (title === 'LSP Servers') {
    if (!values.lsp_enabled) return { lsp: false }
    const currentLspConfig = objectValue(card.patch.lsp) ?? {}
    const lspConfig = Object.fromEntries(Object.entries(currentLspConfig).map(([name, value]) => {
      const lspOverride = objectValue(value)
      return [name, lspOverride ? { ...lspOverride } : value]
    })) as Record<string, unknown>

    BUILT_IN_LSP_SERVERS.forEach((server) => {
      const currentOverride = objectValue(lspConfig[server.name]) ?? {}
      const disabled = Boolean(values[lspDisabledKey(server.name)])
      if (disabled) {
        lspConfig[server.name] = { ...currentOverride, disabled: true }
        return
      }
      if (objectValue(lspConfig[server.name])) {
        const nextOverride = { ...currentOverride }
        delete nextOverride.disabled
        if (Object.keys(nextOverride).length > 0) lspConfig[server.name] = nextOverride
        else delete lspConfig[server.name]
      }
    })
    return { lsp: Object.keys(lspConfig).length > 0 ? lspConfig : true }
  }
  if (title === 'Watcher') return { watcher: { ignore: lineValues(values.ignore) } }
  if (title === 'Instructions') return { instructions: lineValues(values.instructions) }
  if (title === 'Provider') {
    const knownProviderIds = new Set(providers.map((provider) => provider.id))
    const hiddenDisabledProviders = stringArray(card.patch.disabled_providers).filter((providerId) => !knownProviderIds.has(providerId))
    const selectedDisabledProviders = providers.filter((provider) => Boolean(values[providerDisabledKey(provider.id)])).map((provider) => provider.id)
    return { disabled_providers: [...hiddenDisabledProviders, ...selectedDisabledProviders] }
  }

  return {
    provider: parseJsonObject(values.provider, 'Provider JSON'),
    enabled_providers: lineValues(values.enabled_providers),
    disabled_providers: lineValues(values.disabled_providers),
  }
}

function textValue(value: ConfigFormValue | undefined) {
  return typeof value === 'string' ? value.trim() : ''
}

function numberValue(value: ConfigFormValue | undefined) {
  const text = textValue(value)
  if (!text) return undefined
  const parsed = Number(text)
  if (!Number.isFinite(parsed)) throw new Error(`Invalid number: ${text}`)
  return parsed
}

export function lineValues(value: ConfigFormValue | undefined) {
  return textValue(value).split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean)
}

function linesFromUnknown(value: unknown) {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).join('\n')
  return ''
}

function stringifyJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}

function parseJsonObject(value: ConfigFormValue | undefined, label: string) {
  const text = textValue(value)
  if (!text) return {}
  const parsed = JSON.parse(text) as unknown
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error(`${label} must be a JSON object`)
  return parsed as Record<string, unknown>
}

function removeEmptyObjectValues(record: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined && value !== ''))
}

export function formatterDisabledKey(name: string) {
  return `formatter_disabled:${name}`
}

function formatterDisabledValues(value: unknown) {
  const config = objectValue(value)
  return Object.fromEntries(BUILT_IN_FORMATTERS.map((formatter) => [
    formatterDisabledKey(formatter.name),
    objectValue(config?.[formatter.name])?.disabled === true,
  ]))
}

export function lspDisabledKey(name: string) {
  return `lsp_disabled:${name}`
}

function lspDisabledValues(value: unknown) {
  const config = objectValue(value)
  return Object.fromEntries(BUILT_IN_LSP_SERVERS.map((server) => [
    lspDisabledKey(server.name),
    objectValue(config?.[server.name])?.disabled === true,
  ]))
}

export function providerDisabledKey(id: string) {
  return `provider_disabled:${id}`
}

function providerDisabledValues(value: unknown, providers: ProviderItem[]) {
  const disabledProviderIds = new Set(stringArray(value))
  return Object.fromEntries(providers.map((provider) => [
    providerDisabledKey(provider.id),
    disabledProviderIds.has(provider.id),
  ]))
}

export function buildConfigSettingCards(config: ConfigRecord): ConfigSettingCard[] {
  const server = objectValue(config.server)
  const tools = objectValue(config.tools)
  const formatter = config.formatter
  const lsp = config.lsp
  const watcher = objectValue(config.watcher)
  const attachment = objectValue(config.attachment)
  const imageAttachment = objectValue(attachment?.image)
  const disabledProviders = stringArray(config.disabled_providers)
  const enabledProviders = stringArray(config.enabled_providers)
  const providers = objectValue(config.provider)
  const instructions = stringArray(config.instructions)
  const disabledTools = tools ? Object.entries(tools).filter(([, value]) => value === false).map(([key]) => key) : []
  const enabledTools = tools ? Object.entries(tools).filter(([, value]) => value === true).map(([key]) => key) : []

  return [
    {
      title: 'Server',
      configKey: 'server',
      icon: Server,
      tone: 'success',
      status: 'enabled',
      detail: server ? 'Configured from the active OpenCode config.' : 'Using OpenCode server defaults.',
      rows: [
        { label: 'hostname', value: stringValue(server?.hostname, '127.0.0.1') },
        { label: 'port', value: stringValue(server?.port, '4096') },
        { label: 'cors', value: stringList(server?.cors, 'default origins') },
      ],
      patch: { server: server ?? { hostname: '127.0.0.1', port: 4097, cors: ['http://localhost:5173', 'http://127.0.0.1:5173'] } },
    },
    {
      title: 'Tools',
      configKey: 'tools',
      icon: Wrench,
      tone: disabledTools.length ? 'warning' : 'success',
      status: disabledTools.length ? 'partially disabled' : 'enabled',
      detail: disabledTools.length ? `${disabledTools.length} tool(s) disabled.` : 'All OpenCode tools are available by default.',
      rows: [
        { label: 'enabled', value: enabledTools.length ? enabledTools.join(', ') : 'default all' },
        { label: 'disabled', value: disabledTools.length ? disabledTools.join(', ') : 'none' },
      ],
      patch: { tools: tools ?? {} },
    },
    {
      title: 'Models',
      configKey: 'model, small_model',
      icon: Sparkles,
      tone: config.model || config.small_model ? 'success' : 'neutral',
      status: config.model || config.small_model ? 'configured' : 'default',
      detail: 'Primary and lightweight model targets.',
      rows: [
        { label: 'model', value: stringValue(config.model, 'OpenCode runtime default') },
        { label: 'small_model', value: stringValue(config.small_model, 'OpenCode runtime default') },
      ],
      patch: { model: typeof config.model === 'string' ? config.model : '', small_model: typeof config.small_model === 'string' ? config.small_model : '' },
    },
    {
      title: 'Image attachments',
      configKey: 'attachment.image',
      icon: Image,
      tone: 'success',
      status: 'enabled',
      detail: imageAttachment ? 'Image attachment limits are configured.' : 'Image attachments use OpenCode defaults.',
      rows: [
        { label: 'auto_resize', value: stringValue(imageAttachment?.auto_resize, 'default') },
        { label: 'max_width', value: stringValue(imageAttachment?.max_width, 'default') },
        { label: 'max_height', value: stringValue(imageAttachment?.max_height, 'default') },
        { label: 'max_base64_bytes', value: stringValue(imageAttachment?.max_base64_bytes, 'default') },
      ],
      patch: { attachment: { image: imageAttachment ?? { auto_resize: true } } },
    },
    {
      title: 'Snapshot',
      configKey: 'snapshot',
      icon: Camera,
      tone: config.snapshot === false ? 'danger' : 'success',
      status: config.snapshot === false ? 'disabled' : 'enabled',
      detail: config.snapshot === false ? 'Agent file snapshots are disabled.' : 'Agent file snapshots can be used for rollback.',
      rows: [{ label: 'value', value: stringValue(config.snapshot, 'true') }],
      patch: { snapshot: config.snapshot === false ? false : true },
    },
    {
      title: 'Formatters',
      configKey: 'formatter',
      icon: Code2,
      tone: formatterEnabled(formatter) ? 'success' : 'neutral',
      status: formatterEnabled(formatter) ? 'enabled' : 'disabled',
      detail: formatterDetail(formatter),
      rows: [
        { label: 'mode', value: formatterMode(formatter) },
        { label: 'overrides', value: objectKeys(formatter).join(', ') || 'none' },
      ],
      patch: { formatter: formatter ?? false },
    },
    {
      title: 'LSP Servers',
      configKey: 'lsp',
      icon: MonitorCog,
      tone: lspEnabled(lsp) ? 'success' : 'neutral',
      status: lspEnabled(lsp) ? 'enabled' : 'disabled',
      detail: lspDetail(lsp),
      rows: [
        { label: 'mode', value: lspMode(lsp) },
        { label: 'servers', value: objectKeys(lsp).join(', ') || 'none' },
      ],
      patch: { lsp: lsp ?? false },
    },
    {
      title: 'Watcher',
      configKey: 'watcher',
      icon: HardDrive,
      tone: 'success',
      status: 'enabled',
      detail: watcher ? 'File watcher ignore rules are configured.' : 'File watcher uses OpenCode defaults.',
      rows: [{ label: 'ignore', value: stringList(watcher?.ignore, 'default') }],
      patch: { watcher: watcher ?? { ignore: [] } },
    },
    {
      title: 'Instructions',
      configKey: 'instructions',
      icon: FileText,
      tone: instructions.length ? 'success' : 'neutral',
      status: instructions.length ? 'configured' : 'default',
      detail: instructions.length ? `${instructions.length} instruction source(s) configured.` : 'Using default instruction discovery.',
      rows: [{ label: 'paths', value: instructions.join(', ') || 'default discovery' }],
      patch: { instructions },
    },
    {
      title: 'Provider',
      configKey: 'provider, disabled_providers, enabled_providers',
      icon: Settings2,
      tone: disabledProviders.length || enabledProviders.length ? 'warning' : 'success',
      status: disabledProviders.length ? 'custom disabled' : enabledProviders.length ? 'allowlist' : 'enabled',
      detail: providerDetail(disabledProviders, enabledProviders, providers),
      rows: [
        { label: 'configured', value: Object.keys(providers ?? {}).join(', ') || 'none' },
        { label: 'enabled', value: enabledProviders.join(', ') || 'all by default' },
        { label: 'disabled', value: disabledProviders.join(', ') || 'none' },
      ],
      patch: { provider: providers ?? {}, enabled_providers: enabledProviders, disabled_providers: disabledProviders },
    },
  ]
}

function objectValue(value: unknown): ConfigRecord | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as ConfigRecord : null
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : []
}

function stringValue(value: unknown, fallback: string) {
  if (typeof value === 'string' && value.trim()) return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return fallback
}

function stringList(value: unknown, fallback: string) {
  const list = stringArray(value)
  return list.length ? list.join(', ') : fallback
}

function objectKeys(value: unknown) {
  const record = objectValue(value)
  return record ? Object.keys(record) : []
}

function formatterEnabled(value: unknown) {
  return value === true || objectValue(value) !== null
}

function formatterMode(value: unknown) {
  if (value === true) return 'built-ins'
  if (objectValue(value)) return 'built-ins with overrides'
  return 'off'
}

function formatterDetail(value: unknown) {
  if (value === true) return 'All built-in formatters are enabled.'
  if (objectValue(value)) return 'Built-in formatters are enabled with custom overrides.'
  return 'Formatter config is disabled or omitted.'
}

function lspEnabled(value: unknown) {
  return value === true || objectValue(value) !== null
}

function lspMode(value: unknown) {
  if (value === true) return 'built-ins'
  if (objectValue(value)) return 'built-ins with server overrides'
  return 'off'
}

function lspDetail(value: unknown) {
  if (value === true) return 'All built-in LSP servers are enabled.'
  if (objectValue(value)) return 'Built-in LSP servers are enabled with server overrides.'
  return 'LSP config is disabled or omitted.'
}

function providerDetail(disabledProviders: string[], enabledProviders: string[], providers: ConfigRecord | null) {
  if (disabledProviders.length) return `${disabledProviders.length} provider(s) explicitly disabled.`
  if (enabledProviders.length) return `${enabledProviders.length} provider(s) allowed.`
  if (providers && Object.keys(providers).length) return `${Object.keys(providers).length} provider config block(s) declared.`
  return 'All loaded providers remain enabled by default.'
}
