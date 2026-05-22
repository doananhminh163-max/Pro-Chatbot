import {
  Bot,
  ChevronRight,
  Folder,
  History,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  User,
  type LucideIcon,
} from 'lucide-react'
import { sections, type NavId } from '../../navigation'
import type { AppState } from '../../types/appData'

export function Sidebar({
  activePage,
  collapsed,
  data,
  onToggleCollapse,
  onNavigate,
  onNewChat,
}: {
  activePage: NavId
  collapsed: boolean
  data: AppState | null
  onToggleCollapse: () => void
  onNavigate: (id: NavId) => void
  onNewChat: () => void
}) {
  const badgeFor = (id: NavId) => {
    if (!data) return 0
    if (id === 'permissions') return data.navBadges.permissions
    return 0
  }

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="brand-row">
        <button className="brand-mark" type="button" onClick={() => onNavigate('chat')}>
          <Bot size={21} />
        </button>
        {!collapsed && (
          <div className="brand-copy">
            <strong>Pro Chatbot</strong>
            <span>OpenCode control plane</span>
          </div>
        )}
        <button
          className="icon-button collapse-button"
          type="button"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggleCollapse}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <div className="sidebar-actions" aria-label="Quick actions">
        <SidebarButton collapsed={collapsed} icon={Plus} label="New Chat" onClick={onNewChat} />
        <SidebarButton collapsed={collapsed} icon={History} label="Session" onClick={() => onNavigate('sessions')} />
      </div>

      <section className="project-switcher">
        {!collapsed && <span className="section-label">Project</span>}
        <button className="project-card" type="button" onClick={() => onNavigate('chat')}>
          <Folder size={18} />
          {!collapsed && (
            <span>
              <strong>{data?.project.name ?? 'Loading workspace'}</strong>
              <small>{data?.project.rootPath ?? 'Waiting for backend data'}</small>
            </span>
          )}
          {!collapsed && <ChevronRight size={16} />}
        </button>
      </section>

      <nav className="sidebar-nav">
        {sections.map((section) => (
          <section className="nav-section" key={section.title}>
            {!collapsed && <span className="section-label">{section.title}</span>}
            {section.items.map((item) => {
              const Icon = item.icon
              const badge = badgeFor(item.id)
              return (
                <button
                  className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
                  type="button"
                  key={item.id}
                  title={collapsed ? item.label : undefined}
                  aria-current={activePage === item.id ? 'page' : undefined}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon size={19} />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && badge > 0 && <span className="nav-badge">{badge}</span>}
                </button>
              )
            })}
          </section>
        ))}
      </nav>

      <div className="account-card">
        <span className="avatar">
          <User size={18} />
        </span>
        {!collapsed && (
          <span className="account-copy">
            <strong>Local Admin</strong>
            <small>{data ? `Updated ${new Date(data.generatedAt).toLocaleTimeString()}` : 'Workspace settings'}</small>
          </span>
        )}
        {!collapsed && <MoreHorizontal size={18} />}
      </div>
    </aside>
  )
}
function SidebarButton({
  icon: Icon,
  label,
  collapsed,
  onClick,
}: {
  icon: LucideIcon
  label: string
  collapsed: boolean
  onClick: () => void
}) {
  return (
    <button className="sidebar-item primary" type="button" title={collapsed ? label : undefined} onClick={onClick}>
      <Icon size={19} />
      {!collapsed && <span>{label}</span>}
    </button>
  )
}
