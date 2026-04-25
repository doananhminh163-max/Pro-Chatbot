import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function getInitials(displayName: string) {
  const parts = displayName
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) {
    return 'U'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export default function ProfileLayout() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const displayName = user?.fullName || user?.username || 'User Profile'

  const handleBackToWorkspace = () => {
    navigate('/dashboard')
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <Box className="profile-shell">
      <Box className="profile-shell__content">
        <Stack className="profile-shell__toolbar" direction="row" spacing={1.5}>
          <Button
            color="inherit"
            onClick={handleBackToWorkspace}
            startIcon={<ArrowBackRoundedIcon />}
            variant="outlined"
          >
            Back to workspace
          </Button>
          <Button
            color="inherit"
            onClick={handleSignOut}
            startIcon={<LogoutRoundedIcon />}
            variant="text"
          >
            Sign out
          </Button>
        </Stack>

        <Box className="profile-header-card">
          <Stack direction="row" spacing={2.5} sx={{ alignItems: 'center' }}>
            <Avatar className="profile-header-card__avatar">{getInitials(displayName)}</Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" className="profile-header-card__title">
                {displayName}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {user?.email ?? 'No email configured'}
              </Typography>
            </Box>
          </Stack>

          <Chip label={user?.role ?? 'CLIENT'} size="small" variant="outlined" />
        </Box>

        <Box className="profile-shell__body">
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
