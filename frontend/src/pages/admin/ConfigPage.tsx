import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import PageSection from '../../components/PageSection'

export default function ConfigPage() {
  return (
    <Stack spacing={3}>
      <PageSection
        title="CLI Config"
        subtitle="Manage provider command templates and fallback execution policy"
      >
        <Paper className="settings-panel" variant="outlined">
          <Stack spacing={2}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Gemini CLI command"
              defaultValue="gemini --model=gemini-3.1-pro --stdin"
            />
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="OpenCode command"
              defaultValue="opencode chat --mode=assistant --stdin"
            />
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Fallback policy"
              defaultValue="Try Gemini first. If process exits non-zero or timeout > 20s, retry once then switch to OpenCode."
            />

            <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
              <Button variant="outlined">Dry Run</Button>
              <Button variant="contained">Save Config</Button>
            </Stack>
          </Stack>
        </Paper>
      </PageSection>

      <PageSection title="Security note">
        <Typography variant="body2" color="text.secondary">
          Secrets should be stored in backend environment variables and never embedded in client-side config.
        </Typography>
      </PageSection>
    </Stack>
  )
}
