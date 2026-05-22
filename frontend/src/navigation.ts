import {
  Activity,
  AlertTriangle,
  Bot,
  Check,
  History,
  Package,
  Server,
  Terminal,
  type LucideIcon,
} from 'lucide-react'
import type { ConfigChange } from './types/appData'

export type NavId =
  | 'chat'
  | 'agents'
  | 'permissions'
  | 'skills'
  | 'mcp'
  | 'commands'
  | 'sessions'

export type NavItem = {
  id: NavId
  label: string
  icon: LucideIcon
}

export const pagePaths: Record<NavId, string> = {
  chat: '/chat',
  agents: '/agents',
  permissions: '/permissions',
  skills: '/skills',
  mcp: '/mcp',
  commands: '/commands',
  sessions: '/sessions',
}

const navIds = new Set<NavId>([
  'chat',
  'agents',
  'permissions',
  'skills',
  'mcp',
  'commands',
  'sessions',
])

export function pagePath(id: NavId) {
  return pagePaths[id]
}

export function chatNewPath() {
  return '/chat/new'
}

export function chatSessionPath(sessionId: string) {
  return `/chat/${encodeURIComponent(sessionId)}`
}

export function navIdFromPathname(pathname: string): NavId {
  const [segment] = pathname.split('/').filter(Boolean)
  if (!segment) return 'chat'
  return navIds.has(segment as NavId) ? segment as NavId : 'chat'
}

export function isKnownPagePath(pathname: string) {
  const [segment] = pathname.split('/').filter(Boolean)
  return !segment || navIds.has(segment as NavId)
}

export function chatSessionIdFromPathname(pathname: string) {
  const [segment, sessionId] = pathname.split('/').filter(Boolean)
  if (segment !== 'chat' || !sessionId || sessionId === 'new') {
    return null
  }
  return decodeURIComponent(sessionId)
}

export function isNewChatPath(pathname: string) {
  const [segment, mode] = pathname.split('/').filter(Boolean)
  return segment === 'chat' && mode === 'new'
}

export type Section = {
  title: string
  items: NavItem[]
}

export const sections: Section[] = [
  {
    title: 'Config',
    items: [
      { id: 'agents', label: 'Agents', icon: Bot },
      { id: 'skills', label: 'Skills', icon: Package },
      { id: 'mcp', label: 'MCP Servers', icon: Server },
      { id: 'commands', label: 'Commands', icon: Terminal },
    ],
  },
]

export const pageTitles: Record<NavId, { title: string; eyebrow: string; description: string }> = {
  chat: {
    title: 'Chatbot',
    eyebrow: 'Natural language control',
    description: 'Create proposals from live workspace data before applying any risky change.',
  },
  agents: {
    title: 'Agents',
    eyebrow: 'Agent registry',
    description: 'Agents returned by OpenCode and local project agent files.',
  },
  permissions: {
    title: 'Tools & Permissions',
    eyebrow: 'Policy surface',
    description: 'Effective permissions parsed from the current OpenCode config.',
  },
  skills: {
    title: 'Skills',
    eyebrow: 'Local skills',
    description: 'Installed project and global skills read from disk.',
  },
  mcp: {
    title: 'MCP Servers',
    eyebrow: 'Connection control',
    description: 'MCP servers parsed from workspace config.',
  },
  commands: {
    title: 'Commands',
    eyebrow: 'Template preview',
    description: 'Commands discovered from .opencode/commands and .agents/commands.',
  },
  sessions: {
    title: 'Sessions',
    eyebrow: 'Runtime context',
    description: 'Manage persisted local chat sessions and their linked OpenCode runtime sessions.',
  },
}

const detailPanelPages = new Set<NavId>()

export function pageUsesDetailPanel(activePage: NavId, pendingChange: ConfigChange | null) {
  return activePage !== 'chat' && (pendingChange !== null || detailPanelPages.has(activePage))
}

export const metricIcons: Record<string, LucideIcon> = {
  'OpenCode server': Activity,
  'Config health': Check,
  'Risk queue': AlertTriangle,
  Backups: History,
}
