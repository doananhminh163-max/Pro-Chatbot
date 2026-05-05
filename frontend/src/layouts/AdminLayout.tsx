import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import StorageRoundedIcon from '@mui/icons-material/StorageRounded'
import WorkspaceLayout from './WorkspaceLayout'
import type { NavigationItem } from '../types/navigation'

const adminNavigationItems: NavigationItem[] = [
  { label: 'Users', path: '/admin/users', icon: GroupRoundedIcon },
  { label: 'Agents', path: '/admin/agents', icon: SmartToyRoundedIcon },
  { label: 'Providers', path: '/admin/providers', icon: StorageRoundedIcon },
]

export default function AdminLayout() {
  return (
    <WorkspaceLayout
      title="Admin Console"
      navigationItems={adminNavigationItems}
      profileLabel="Admin"
      searchPlaceholder="Search users, agents, providers, policy events..."
      shellVariant="admin"
    />
  )
}
