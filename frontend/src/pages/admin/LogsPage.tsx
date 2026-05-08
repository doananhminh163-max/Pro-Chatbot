import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import PageSection from '../../components/PageSection'
import { fetchAdminLogs, type AdminLogRecord } from '../../services/admin'

function levelColor(level: 'INFO' | 'ERROR') {
  return level === 'ERROR' ? 'error' : 'success'
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default function LogsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [logs, setLogs] = useState<AdminLogRecord[]>([])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)

      try {
        setLogs(await fetchAdminLogs())
      } catch (loadError) {
        setError((loadError as Error).message || 'Failed to load execution logs.')
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [])

  const filteredLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return logs
    }

    return logs.filter((log) => {
      const haystack = [
        log.message,
        log.sessionTitle,
        log.userEmail,
        log.agentName || '',
        log.level,
      ].join(' ').toLowerCase()

      return haystack.includes(normalizedQuery)
    })
  }, [logs, query])

  if (loading) {
    return (
      <Box className="admin-loading-shell">
        <CircularProgress size={28} />
      </Box>
    )
  }

  return (
    <Stack spacing={3}>
      {error ? <Alert severity="error">{error}</Alert> : null}

      <PageSection
        title="Execution Logs"
        subtitle="System-level messages emitted from chat sessions, including CLI failures."
        action={(
          <TextField
            size="small"
            placeholder="Filter by session, user, agent, or error text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            sx={{ minWidth: { xs: '100%', md: 320 } }}
          />
        )}
      >
        <Paper className="admin-log-shell" variant="outlined">
          <Stack spacing={1.25}>
            {filteredLogs.map((log) => (
              <Box key={log.id} className="admin-log-card">
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} sx={{ justifyContent: 'space-between', alignItems: { md: 'flex-start' } }}>
                  <Stack spacing={0.9} sx={{ minWidth: 0 }}>
                    <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                      <Chip size="small" label={log.level} color={levelColor(log.level)} />
                      <Chip size="small" label={log.agentName || 'No agent'} variant="outlined" />
                      <Typography variant="caption" color="text.secondary">{log.userEmail}</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {log.message}
                    </Typography>
                  </Stack>

                  <Stack spacing={0.45} sx={{ minWidth: { md: 220 } }}>
                    <Typography variant="caption" color="text.secondary">{formatDateTime(log.createdAt)}</Typography>
                    <Typography variant="subtitle2">{log.sessionTitle}</Typography>
                    <Typography variant="caption" color="text.secondary">Session ID: {log.sessionId}</Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}

            {filteredLogs.length === 0 ? (
              <Box className="admin-table-empty">
                <Typography variant="subtitle2">No matching logs</Typography>
                <Typography variant="body2" color="text.secondary">
                  The current query does not match any recent system messages.
                </Typography>
              </Box>
            ) : null}
          </Stack>
        </Paper>
      </PageSection>
    </Stack>
  )
}
