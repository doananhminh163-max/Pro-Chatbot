import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import PageSection from '../../components/PageSection'
import { fetchAdminConfig, type AdminRuntimeConfig } from '../../services/admin'

export default function ConfigPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [config, setConfig] = useState<AdminRuntimeConfig | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)

      try {
        setConfig(await fetchAdminConfig())
      } catch (loadError) {
        setError((loadError as Error).message || 'Failed to load runtime config.')
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [])

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

      <PageSection title="CLI Runtime" subtitle="Read-only visibility into the active broker command templates.">
        <Paper className="settings-panel admin-table-shell" variant="outlined">
          <Stack spacing={2}>
            <TextField fullWidth multiline minRows={2} label="Gemini CLI command" value={config?.commands.gemini || ''} slotProps={{ input: { readOnly: true } }} />
            <TextField fullWidth multiline minRows={2} label="OpenCode CLI command" value={config?.commands.opencode || ''} slotProps={{ input: { readOnly: true } }} />
          </Stack>
        </Paper>
      </PageSection>

      <Box className="admin-two-column-grid admin-two-column-grid--narrow">
        <PageSection title="Sandbox" subtitle="Operational sandbox settings currently enforced by the backend.">
          <Paper className="settings-panel admin-table-shell" variant="outlined">
            <Stack spacing={2}>
              <TextField fullWidth label="Sandbox root" value={config?.sandbox.root || ''} slotProps={{ input: { readOnly: true } }} />
              <TextField fullWidth label="Broker URL" value={config?.sandbox.brokerUrl || ''} slotProps={{ input: { readOnly: true } }} />
              <TextField fullWidth label="Sandbox TTL (ms)" value={String(config?.sandbox.ttlMs || '')} slotProps={{ input: { readOnly: true } }} />
              <TextField fullWidth label="Request timeout (ms)" value={String(config?.sandbox.requestTimeoutMs || '')} slotProps={{ input: { readOnly: true } }} />
            </Stack>
          </Paper>
        </PageSection>

        <PageSection title="Storage" subtitle="Document root used for user uploads and extracted artifacts.">
          <Paper className="settings-panel admin-table-shell" variant="outlined">
            <Stack spacing={2}>
              <TextField fullWidth label="User docs root" value={config?.storage.userDocsRoot || ''} slotProps={{ input: { readOnly: true } }} />
              <Paper variant="outlined" className="admin-insight-card">
                <Typography variant="body2" color="text.secondary">
                  Runtime editing is intentionally disabled here. These values come from backend environment configuration so operational changes remain explicit and auditable.
                </Typography>
              </Paper>
            </Stack>
          </Paper>
        </PageSection>
      </Box>
    </Stack>
  )
}
