import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import PageSection from '../../components/PageSection'
import AdminMetricCard from '../../components/admin/AdminMetricCard'
import { fetchAdminOverview, fetchAdminUsers, type AdminOverview, type AdminUserRecord } from '../../services/admin'

function formatDateTime(value: string | null) {
  if (!value) {
    return 'No session activity'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function roleColor(role: 'CLIENT' | 'ADMIN') {
  return role === 'ADMIN' ? 'warning' : 'default'
}

export default function UsersPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [users, setUsers] = useState<AdminUserRecord[]>([])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)

      try {
        const [overviewPayload, usersPayload] = await Promise.all([
          fetchAdminOverview(),
          fetchAdminUsers(),
        ])
        setOverview(overviewPayload)
        setUsers(usersPayload)
      } catch (loadError) {
        setError((loadError as Error).message || 'Failed to load admin user data.')
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [])

  const totalStorage = useMemo(
    () => users.reduce((sum, user) => sum + user.storageBytes, 0),
    [users],
  )

  const storageLabel = useMemo(() => {
    if (totalStorage <= 0) {
      return '0 B'
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = totalStorage
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex += 1
    }

    return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
  }, [totalStorage])

  const topStorageUsers = useMemo(
    () => [...users].sort((left, right) => right.storageBytes - left.storageBytes).slice(0, 4),
    [users],
  )

  if (loading) {
    return (
      <Box className="admin-loading-shell">
        <CircularProgress size={28} />
      </Box>
    )
  }

  return (
    <Stack spacing={3}>
      <Box className="admin-summary-grid">
        <AdminMetricCard label="Users" value={overview?.userCount || 0} caption="Registered identities in the system" accent="cyan" />
        <AdminMetricCard label="Sessions" value={overview?.sessionCount || 0} caption="Conversation sessions across all users" accent="amber" />
        <AdminMetricCard label="Documents" value={overview?.documentCount || 0} caption="Uploaded assets and extracted files" accent="green" />
        <AdminMetricCard label="Storage" value={storageLabel} caption="Total user document footprint" accent="red" />
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Box className="admin-board-grid">
        <PageSection
          title="User Inventory"
          subtitle="Live user, memory, session, and storage data from the backend."
        >
          <Paper variant="outlined" className="table-shell admin-table-shell">
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Sessions</TableCell>
                    <TableCell align="right">Documents</TableCell>
                    <TableCell align="right">Memory</TableCell>
                    <TableCell align="right">Storage</TableCell>
                    <TableCell>Last Seen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Stack spacing={0.35}>
                          <Typography variant="subtitle2">{user.fullName || user.username || user.email}</Typography>
                          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={user.role} color={roleColor(user.role)} variant="outlined" />
                      </TableCell>
                      <TableCell align="right">{user.sessionCount}</TableCell>
                      <TableCell align="right">{user.documentCount}</TableCell>
                      <TableCell align="right">{user.memoryCount}</TableCell>
                      <TableCell align="right">{user.storageLabel}</TableCell>
                      <TableCell>{formatDateTime(user.lastSeenAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </PageSection>

        <Paper variant="outlined" className="admin-insight-rail">
          <Stack spacing={2}>
            <Box>
              <Typography variant="overline" className="admin-insight-rail__eyebrow">
                Capacity Readout
              </Typography>
              <Typography variant="h6">Highest Storage Users</Typography>
              <Typography variant="body2" color="text.secondary">
                Use this list to identify heavy document users before storage becomes the next bottleneck.
              </Typography>
            </Box>

            {topStorageUsers.map((user) => (
              <Box key={user.id} className="admin-insight-card">
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle2">{user.fullName || user.username || user.email}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  </Box>
                  <Chip size="small" label={user.storageLabel} color="warning" />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {user.documentCount} documents, {user.sessionCount} sessions, {user.memoryCount} memories.
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Stack>
  )
}
