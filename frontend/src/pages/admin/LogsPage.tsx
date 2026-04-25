import { Chip, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material'
import PageSection from '../../components/PageSection'

const logs = [
  {
    id: 'l1',
    level: 'INFO',
    message: 'Gemini CLI request completed in 3.2s',
    time: '18:14:09',
  },
  {
    id: 'l2',
    level: 'WARNING',
    message: 'OpenCode fallback triggered after timeout',
    time: '18:11:42',
  },
  {
    id: 'l3',
    level: 'ERROR',
    message: 'OCR parsing failed for file invoice_0422.png',
    time: '17:56:13',
  },
]

function levelColor(level: string) {
  if (level === 'INFO') return 'success'
  if (level === 'WARNING') return 'warning'
  return 'error'
}

export default function LogsPage() {
  return (
    <Stack spacing={3}>
      <PageSection title="System Logs" subtitle="Observe provider, parser, and orchestration runtime events">
        <Paper className="session-history-shell" variant="outlined">
          <List disablePadding>
            {logs.map((log) => (
              <ListItem key={log.id} divider>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <Chip size="small" label={log.level} color={levelColor(log.level)} />
                      <Typography variant="body2">{log.message}</Typography>
                    </Stack>
                  }
                  secondary={`Time: ${log.time}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </PageSection>
    </Stack>
  )
}
