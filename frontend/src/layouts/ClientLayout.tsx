import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import ForumRoundedIcon from '@mui/icons-material/ForumRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import PsychologyAltRoundedIcon from '@mui/icons-material/PsychologyAltRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import WorkspaceLayout from './WorkspaceLayout'
import type { NavigationItem } from '../types/navigation'

const clientNavigationItems: NavigationItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardRoundedIcon },
  {
    label: 'Chatbot',
    path: '/chat',
    icon: ForumRoundedIcon,
    badge: 'Live',
    children: [
      { label: 'New Session', path: '/chat?newSession=true' },
      { label: 'Sessions', path: '/sessions' },
    ],
  },
  { label: 'Documents', path: '/documents', icon: DescriptionRoundedIcon },
  { label: 'Memory', path: '/memory', icon: PsychologyAltRoundedIcon },
  { label: 'Personalization', path: '/personalization', icon: TuneRoundedIcon },
  { label: 'Settings', path: '/settings', icon: SettingsRoundedIcon },
]

export default function ClientLayout() {
  return (
    <WorkspaceLayout
      title="Client Workspace"
      navigationItems={clientNavigationItems}
      profileLabel="Client"
    />
  )
}
