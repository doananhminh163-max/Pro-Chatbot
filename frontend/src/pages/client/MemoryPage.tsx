import { Chip, Grid, Paper, Stack, Typography } from '@mui/material'
import PageSection from '../../components/PageSection'

const memoryItems = [
  {
    id: 'm1',
    title: 'Session Memory - Product Review',
    summary: 'User prefers concise bullet summaries and implementation-first responses.',
    lastUsed: '10 minutes ago',
    type: 'Session',
  },
  {
    id: 'm2',
    title: 'Global Memory - Coding Preferences',
    summary: 'TypeScript strict mode, React + Vite stack, MUI + SCSS visual system.',
    lastUsed: '1 hour ago',
    type: 'Global',
  },
  {
    id: 'm3',
    title: 'Style Profile',
    summary: 'Prefers technical tone, short direct responses, and final answer in Vietnamese.',
    lastUsed: 'Yesterday',
    type: 'Profile',
  },
]

export default function MemoryPage() {
  return (
    <Stack spacing={3}>
      <PageSection
        title="Memory"
        subtitle="Manage contextual memory layers for session continuity and personalization"
      >
        <Stack direction="row" spacing={1}>
          <Chip label="Session Memory" color="primary" variant="outlined" />
          <Chip label="Global Memory" variant="outlined" />
          <Chip label="User Style Profile" variant="outlined" />
        </Stack>
      </PageSection>

      <Grid container spacing={2.25}>
        {memoryItems.map((item) => (
          <Grid key={item.id} size={{ xs: 12, lg: 4 }}>
            <Paper className="memory-card" variant="outlined">
              <Stack spacing={1.25}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">{item.title}</Typography>
                  <Chip size="small" label={item.type} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {item.summary}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last used: {item.lastUsed}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
