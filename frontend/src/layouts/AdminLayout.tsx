import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded'
import HubRoundedIcon from '@mui/icons-material/HubRounded'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import StorageRoundedIcon from '@mui/icons-material/StorageRounded'
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import WorkspaceLayout from './WorkspaceLayout'

const adminNavigationItems = [
  { label: 'Users', path: '/admin/users', icon: GroupRoundedIcon },
  { label: 'Skills', path: '/admin/skills', icon: ConstructionRoundedIcon },
  { label: 'MCPs', path: '/admin/mcps', icon: HubRoundedIcon },
  { label: 'Agents', path: '/admin/agents', icon: SmartToyRoundedIcon },
  { label: 'Providers', path: '/admin/providers', icon: StorageRoundedIcon },
  { label: 'CLI Config', path: '/admin/config', icon: TerminalRoundedIcon },
  { label: 'Logs', path: '/admin/logs', icon: FactCheckRoundedIcon, badge: '12' },
]

export default function AdminLayout() {
  return (
    <WorkspaceLayout
      title="Admin Console"
      subtitle="System governance, orchestration policies, and audit controls"
      navigationItems={adminNavigationItems}
      profileLabel="Admin"
    />
  )
}
