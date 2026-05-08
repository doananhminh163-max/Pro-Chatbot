import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import DnsRoundedIcon from '@mui/icons-material/DnsRounded'
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded'
import PageSection from '../../components/PageSection'
import AdminMetricCard from '../../components/admin/AdminMetricCard'
import { fetchAdminProviders, type AdminProviderRecord } from '../../services/admin'

export default function ProvidersPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [providers, setProviders] = useState<AdminProviderRecord[]>([])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)

      try {
        setProviders(await fetchAdminProviders())
      } catch (loadError) {
        setError((loadError as Error).message || 'Failed to load provider catalog.')
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [])

  const totalModels = useMemo(
    () => providers.reduce((sum, provider) => sum + provider.modelCount, 0),
    [providers],
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
        <AdminMetricCard label="Providers" value={providers.length} caption="Configured execution backends" accent="cyan" />
        <AdminMetricCard label="Models" value={totalModels} caption="Models available for client routing" accent="green" />
        <AdminMetricCard label="Gemini" value={providers.find((item) => item.name === 'gemini')?.modelCount || 0} caption="Models seeded under Gemini provider" accent="amber" />
        <AdminMetricCard label="OpenCode" value={providers.find((item) => item.name === 'opencode')?.modelCount || 0} caption="Models exposed through OpenCode" accent="red" />
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <PageSection
        title="Provider Catalog"
        subtitle="Actual provider records and model inventory sourced from the backend database."
      >
        <Box className="admin-provider-grid">
          {providers.map((provider) => (
            <Paper key={provider.id} variant="outlined" className="admin-provider-card">
              <Stack spacing={2}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.25 }}>
                  <Box>
                    <Typography variant="overline" className="admin-section-kicker__label">
                      Provider
                    </Typography>
                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{provider.name}</Typography>
                  </Box>
                  <Chip size="small" icon={<DnsRoundedIcon />} label={`${provider.modelCount} models`} color="info" />
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  {provider.config || 'No provider-specific config string stored.'}
                </Typography>

                <Box className="admin-provider-models">
                  {provider.models.map((model) => (
                    <Box key={model.id} className="admin-provider-model-chip">
                      <MemoryRoundedIcon fontSize="inherit" />
                      <span>{model.name}</span>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Paper>
          ))}
        </Box>
      </PageSection>
    </Stack>
  )
}
