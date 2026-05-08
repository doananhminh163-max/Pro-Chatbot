import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

const GEMINI_HOME = 'C:\\Users\\Admin\\.gemini'
const GEMINI_SETTINGS_PATH = path.join(GEMINI_HOME, 'settings.json')
const GEMINI_ANTIGRAVITY_MCP_PATH = path.join(GEMINI_HOME, 'antigravity', 'mcp_config.json')
const OPENCODE_CONFIG_PATH = 'C:\\Users\\Admin\\.config\\opencode\\opencode.json'
const SKILLS_ROOT = 'C:\\Users\\Admin\\.agents\\skills'

export interface AdminSkillCatalogItem {
  id: string
  name: string
  description: string
  path: string
}

export interface AdminSkillInstruction extends AdminSkillCatalogItem {
  instructions: string
}

export interface AdminMcpCatalogItem {
  id: string
  provider: 'gemini' | 'opencode'
  source: string
  name: string
  command: string
  enabled: boolean
  settings: Record<string, unknown>
}

function fileExists(targetPath: string) {
  return fs.existsSync(targetPath)
}

async function readJsonFile(targetPath: string) {
  if (!fileExists(targetPath)) {
    return null
  }

  try {
    const raw = await fsp.readFile(targetPath, 'utf8')
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return null
  }
}

function extractFrontmatterValue(content: string, key: string) {
  const frontmatterMatch = content.match(/^---\s*([\s\S]*?)\s*---/)

  if (!frontmatterMatch) {
    return null
  }

  const pattern = new RegExp(`^${key}:\\s*(.+)$`, 'm')
  const valueMatch = frontmatterMatch[1]?.match(pattern)

  return valueMatch?.[1]?.trim() || null
}

function stripFrontmatter(content: string) {
  return content.replace(/^---\s*[\s\S]*?\s*---\s*/, '').trim()
}

function toCommandPreview(command: unknown, args?: unknown) {
  if (Array.isArray(command)) {
    return command.join(' ')
  }

  const pieces = [typeof command === 'string' ? command : '']

  if (Array.isArray(args)) {
    pieces.push(...args.filter((item): item is string => typeof item === 'string'))
  }

  return pieces.filter(Boolean).join(' ')
}

function sanitizeMcpName(name: string) {
  return name.trim()
}

export async function listAvailableSkills(): Promise<AdminSkillCatalogItem[]> {
  if (!fileExists(SKILLS_ROOT)) {
    return []
  }

  const entries = await fsp.readdir(SKILLS_ROOT, { withFileTypes: true })
  const skills: AdminSkillCatalogItem[] = []

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue
    }

    const skillDir = path.join(SKILLS_ROOT, entry.name)
    const skillFile = path.join(skillDir, 'SKILL.md')

    if (!fileExists(skillFile)) {
      continue
    }

    const raw = await fsp.readFile(skillFile, 'utf8')
    const description = extractFrontmatterValue(raw, 'description') || 'No description provided.'

    skills.push({
      id: entry.name,
      name: extractFrontmatterValue(raw, 'name') || entry.name,
      description,
      path: skillFile,
    })
  }

  return skills.sort((left, right) => left.name.localeCompare(right.name))
}

export async function readSelectedSkillInstructions(selectedIds: string[]): Promise<AdminSkillInstruction[]> {
  const skills = await listAvailableSkills()
  const skillMap = new Map(skills.map((skill) => [skill.id, skill]))
  const selected: AdminSkillInstruction[] = []

  for (const skillId of selectedIds) {
    const skill = skillMap.get(skillId)

    if (!skill) {
      continue
    }

    const raw = await fsp.readFile(skill.path, 'utf8')
    selected.push({
      ...skill,
      instructions: stripFrontmatter(raw),
    })
  }

  return selected
}

function normalizeGeminiMcpSettings(
  source: string,
  mcpServers: Record<string, unknown>,
): AdminMcpCatalogItem[] {
  return Object.entries(mcpServers).map(([name, value]) => {
    const config = typeof value === 'object' && value ? (value as Record<string, unknown>) : {}

    return {
      id: `gemini:${source}:${name}`,
      provider: 'gemini',
      source,
      name: sanitizeMcpName(name),
      command: toCommandPreview(config.command, config.args),
      enabled: true,
      settings: config,
    }
  })
}

function normalizeOpenCodeMcpSettings(mcpMap: Record<string, unknown>) {
  return Object.entries(mcpMap).map(([name, value]) => {
    const config = typeof value === 'object' && value ? (value as Record<string, unknown>) : {}

    return {
      id: `opencode:config:${name}`,
      provider: 'opencode' as const,
      source: 'config',
      name: sanitizeMcpName(name),
      command: toCommandPreview(config.command),
      enabled: config.enabled !== false,
      settings: config,
    }
  })
}

export async function listAvailableMcps(): Promise<AdminMcpCatalogItem[]> {
  const [geminiSettings, geminiAntigravitySettings, opencodeSettings] = await Promise.all([
    readJsonFile(GEMINI_SETTINGS_PATH),
    readJsonFile(GEMINI_ANTIGRAVITY_MCP_PATH),
    readJsonFile(OPENCODE_CONFIG_PATH),
  ])

  const catalog: AdminMcpCatalogItem[] = []

  const geminiServers = geminiSettings?.mcpServers
  if (geminiServers && typeof geminiServers === 'object') {
    catalog.push(...normalizeGeminiMcpSettings('settings', geminiServers as Record<string, unknown>))
  }

  const antigravityServers = geminiAntigravitySettings?.mcpServers
  if (antigravityServers && typeof antigravityServers === 'object') {
    catalog.push(...normalizeGeminiMcpSettings('antigravity', antigravityServers as Record<string, unknown>))
  }

  const opencodeMcps = opencodeSettings?.mcp
  if (opencodeMcps && typeof opencodeMcps === 'object') {
    catalog.push(...normalizeOpenCodeMcpSettings(opencodeMcps as Record<string, unknown>))
  }

  return catalog.sort((left, right) => left.name.localeCompare(right.name) || left.provider.localeCompare(right.provider))
}

export async function resolveSelectedMcpCatalog(selectedIds: string[]) {
  const mcps = await listAvailableMcps()
  const mcpMap = new Map(mcps.map((item) => [item.id, item]))

  return selectedIds
    .map((id) => mcpMap.get(id))
    .filter((item): item is AdminMcpCatalogItem => Boolean(item))
}

export async function buildGeminiMcpSettings(selectedIds: string[]) {
  const selected = await resolveSelectedMcpCatalog(selectedIds)

  return selected
    .filter((item) => item.provider === 'gemini')
    .reduce<Record<string, unknown>>((accumulator, item) => {
      accumulator[item.name] = item.settings
      return accumulator
    }, {})
}

export async function buildOpenCodeMcpSettings(selectedIds: string[]) {
  const selected = await resolveSelectedMcpCatalog(selectedIds)

  return selected
    .filter((item) => item.provider === 'opencode')
    .reduce<Record<string, unknown>>((accumulator, item) => {
      accumulator[item.name] = item.settings
      return accumulator
    }, {})
}
