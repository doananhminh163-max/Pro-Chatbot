import { useState } from 'react'
import {
  Button,
  Box,
  Chip,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppTheme } from '../contexts/ThemeContext'
import { useAuth } from '../hooks/useAuth'
import type { NavigationItem } from '../types/navigation'

interface WorkspaceLayoutProps {
  title: string
  subtitle?: string
  navigationItems: NavigationItem[]
  profileLabel: string
  eyebrow?: string
  searchPlaceholder?: string
  shellVariant?: 'client' | 'admin'
  statusTag?: string
}

const SIDEBAR_WIDTH = 264

function SidebarContent({
  closeDrawer,
  navigationItems,
  onOpenProfile,
  onSignOut,
  shellVariant,
}: {
  closeDrawer: () => void
  navigationItems: NavigationItem[]
  onOpenProfile: () => void
  onSignOut: () => void
  shellVariant: 'client' | 'admin'
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({})

  const normalizePath = (path: string) => path.split('?')[0]

  const isPathActive = (path: string) => {
    const basePath = normalizePath(path)
    return location.pathname.startsWith(basePath)
  }

  const isItemActive = (item: NavigationItem) => {
    if (item.children?.some((child) => isPathActive(child.path))) {
      return true
    }

    return isPathActive(item.path)
  }

  const isExpanded = (item: NavigationItem) => {
    const currentState = expandedMenus[item.path]

    if (typeof currentState === 'boolean') {
      return currentState
    }

    return isItemActive(item)
  }

  const toggleExpand = (item: NavigationItem) => {
    setExpandedMenus((previous) => ({
      ...previous,
      [item.path]: !(typeof previous[item.path] === 'boolean' ? previous[item.path] : isItemActive(item)),
    }))
  }

  const handleChildNavigate = (path: string) => {
    navigate(path)
    closeDrawer()
  }

  const branding = shellVariant === 'admin'
    ? {
        title: 'Pro Chatbot',
        subtitle: undefined,
        label: undefined,
      }
    : {
        title: 'Pro Chatbot',
        subtitle: undefined,
        label: undefined,
      }

  return (
    <Box className={`app-sidebar-content app-sidebar-content-${shellVariant}`}>
      <Stack className="app-branding" spacing={0.75}>
        {branding.label ? (
          <Typography variant="caption" className="app-branding__eyebrow">
            {branding.label}
          </Typography>
        ) : null}
        <Typography variant="h6" className="app-brand-title">
          {branding.title}
        </Typography>
        {branding.subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {branding.subtitle}
          </Typography>
        ) : null}
      </Stack>

      <List disablePadding className="app-nav-list">
        {navigationItems.map((item) => {
          const isActive = isItemActive(item)

          if (item.children && item.children.length > 0) {
            return (
              <Box key={item.path} className="app-nav-group">
                <ListItemButton
                  onClick={() => toggleExpand(item)}
                  className="app-nav-item"
                  selected={isActive}
                >
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  {item.badge ? <Chip label={item.badge} size="small" /> : null}
                  {isExpanded(item) ? <ExpandLessRoundedIcon fontSize="small" /> : <ExpandMoreRoundedIcon fontSize="small" />}
                </ListItemButton>

                <Collapse in={isExpanded(item)} timeout="auto" unmountOnExit>
                  <List disablePadding className="app-nav-sublist">
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.path}
                        className="app-nav-subitem"
                        selected={isPathActive(child.path)}
                        onClick={() => handleChildNavigate(child.path)}
                      >
                        <ListItemText primary={child.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            )
          }

          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={closeDrawer}
              className="app-nav-item"
              selected={isActive}
            >
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
              {item.badge ? <Chip label={item.badge} size="small" /> : null}
            </ListItemButton>
          )
        })}
      </List>

      <Box className="app-sidebar-bottom">
        <Divider />
        <List disablePadding>
          <ListItemButton className="app-nav-item" onClick={onOpenProfile}>
            <ListItemIcon>
              <PersonOutlineRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
          <ListItemButton className="app-nav-item" onClick={onSignOut}>
            <ListItemIcon>
              <LogoutRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  )
}

export default function WorkspaceLayout({
  title,
  subtitle,
  navigationItems,
  profileLabel,
  eyebrow,
  searchPlaceholder = 'Search sessions, documents, agents...',
  shellVariant = 'client',
  statusTag,
}: WorkspaceLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const theme = useTheme()
  const { mode, toggleTheme } = useAppTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const navigate = useNavigate()
  const { signOut, user } = useAuth()

  const displayLabel = user?.fullName || user?.username || profileLabel
  const isAdmin = user?.role === 'ADMIN'

  const handleOpenProfile = () => {
    navigate('/profile')
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const toggleSidebar = () => {
    if (isDesktop) {
      setSidebarOpen((current) => !current)
      return
    }

    setDrawerOpen(true)
  }

  const handleSwitchWorkspace = () => {
    navigate(shellVariant === 'admin' ? '/chat' : '/admin/users')
  }

  return (
    <Box className={`app-shell app-shell-${shellVariant} ${isDesktop && !sidebarOpen ? 'is-sidebar-hidden' : ''}`}>
      <Box component="aside" className="app-sidebar app-sidebar-desktop">
        <SidebarContent
          closeDrawer={() => undefined}
          navigationItems={navigationItems}
          onOpenProfile={handleOpenProfile}
          onSignOut={handleSignOut}
          shellVariant={shellVariant}
        />
      </Box>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="app-sidebar-mobile"
      >
        <Box sx={{ width: SIDEBAR_WIDTH }}>
          <Stack direction="row" sx={{ p: 1, justifyContent: 'flex-end' }}>
            <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close navigation">
              <CloseIcon />
            </IconButton>
          </Stack>
          <SidebarContent
            closeDrawer={() => setDrawerOpen(false)}
            navigationItems={navigationItems}
            onOpenProfile={handleOpenProfile}
            onSignOut={handleSignOut}
            shellVariant={shellVariant}
          />
        </Box>
      </Drawer>

      <Box
        component="main"
        className="app-main"
        sx={{
          ml: { lg: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0 },
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Box className="app-topbar">
          <Box className="app-topbar__inner">
            <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', minWidth: 0 }}>
              <IconButton
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
                sx={{ color: 'var(--text-secondary)' }}
              >
                <MenuIcon />
              </IconButton>

              <Box className="app-topbar__titles">
                {eyebrow ? (
                  <Typography variant="caption" className="app-topbar__eyebrow">
                    {eyebrow}
                  </Typography>
                ) : null}
                <Typography variant="h5" className="app-topbar__title">
                  {title}
                </Typography>
                {subtitle ? (
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                ) : null}
              </Box>
            </Stack>

            <Box className="app-topbar__search">
              <TextField
                fullWidth
                size="small"
                placeholder={searchPlaceholder}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Stack className="app-topbar__actions" direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              {isAdmin ? (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SwapHorizRoundedIcon fontSize="small" />}
                  onClick={handleSwitchWorkspace}
                >
                  {shellVariant === 'admin' ? 'Client' : 'Admin'}
                </Button>
              ) : null}

              {statusTag ? (
                <Chip
                  icon={<SecurityRoundedIcon />}
                  label={statusTag}
                  size="small"
                  variant="outlined"
                  className="app-status-chip"
                />
              ) : null}

              <Tooltip title="Notifications">
                <IconButton aria-label="Notifications">
                  <NotificationsNoneRoundedIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                <IconButton aria-label="Theme toggle" onClick={toggleTheme}>
                  {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                </IconButton>
              </Tooltip>

              <Box className="app-profile-pill">
                <Typography className="app-profile-pill__name">{displayLabel}</Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Box className="app-content">
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
