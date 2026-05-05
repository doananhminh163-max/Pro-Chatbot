import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded'
import PageSection from '../../components/PageSection'
import {
  clearGlobalMemory,
  fetchMemoryOverview,
  type MemoryEntry,
  type MemoryOverview,
} from '../../services/chat'

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Not updated yet'
  }

  return new Date(value).toLocaleString()
}

function MemoryEntryCard({ entry }: { entry: MemoryEntry }) {
  return (
    <Paper className="memory-card" variant="outlined">
      <Stack spacing={1.25}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle1">{entry.title}</Typography>
          <Chip size="small" label={entry.kind} />
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {entry.content}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Chip size="small" variant="outlined" label={`Importance ${entry.importance}`} />
          {entry.sessionTitle ? <Chip size="small" variant="outlined" label={entry.sessionTitle} /> : null}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Last used: {formatTimestamp(entry.lastUsedAt)}
        </Typography>
      </Stack>
    </Paper>
  )
}

export default function MemoryPage() {
  const [overview, setOverview] = useState<MemoryOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isClearingGlobal, setIsClearingGlobal] = useState(false)

  const loadOverview = async () => {
    setIsLoading(true)
    setError('')

    try {
      const data = await fetchMemoryOverview()
      setOverview(data)
    } catch {
      setError('Unable to load memory overview.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadOverview()
  }, [])

  const handleClearGlobal = async () => {
    setIsClearingGlobal(true)
    setError('')

    try {
      await clearGlobalMemory()
      await loadOverview()
    } catch {
      setError('Unable to clear global memory.')
    } finally {
      setIsClearingGlobal(false)
    }
  }

  return (
    <Stack spacing={3}>
      <PageSection
        title="Memory"
        subtitle="Durable global context that the chatbot can reuse across sessions when memory is enabled in chat"
        action={
          <Button
            variant="outlined"
            color="warning"
            startIcon={<DeleteSweepRoundedIcon />}
            onClick={() => void handleClearGlobal()}
            disabled={isClearingGlobal}
          >
            {isClearingGlobal ? 'Clearing...' : 'Clear global memory'}
          </Button>
        }
      >
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Chip
            label={`Global memories: ${overview?.globalMemories.length ?? 0}`}
            color="primary"
            variant="outlined"
          />
        </Stack>
      </PageSection>

      {error ? <Alert severity="error" onClose={() => setError('')}>{error}</Alert> : null}

      {isLoading ? (
        <Paper className="memory-card" variant="outlined">
          <Stack spacing={1.5} sx={{ alignItems: 'center', py: 4 }}>
            <CircularProgress size={32} />
            <Typography variant="body2" color="text.secondary">
              Loading memory overview...
            </Typography>
          </Stack>
        </Paper>
      ) : (
        <Stack spacing={2}>
          <Typography variant="h6">Global user and work memory</Typography>
          <Grid container spacing={2.25}>
            {(overview?.globalMemories ?? []).map((entry) => (
              <Grid key={entry.id} size={{ xs: 12, lg: 4 }}>
                <MemoryEntryCard entry={entry} />
              </Grid>
            ))}
            {(overview?.globalMemories.length ?? 0) === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Paper className="memory-card" variant="outlined">
                  <Typography variant="body2" color="text.secondary">
                    No durable global memory yet. Once the chatbot can infer your role, stack, preferences, or recurring work, it will persist them here.
                  </Typography>
                </Paper>
              </Grid>
            ) : null}
          </Grid>
        </Stack>
      )}
    </Stack>
  )
}
