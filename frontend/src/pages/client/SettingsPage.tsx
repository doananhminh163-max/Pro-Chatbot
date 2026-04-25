import {
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import PageSection from '../../components/PageSection'
import { useAppTheme } from '../../contexts/ThemeContext'

export default function SettingsPage() {
  const { mode, toggleTheme } = useAppTheme()

  return (
    <Stack spacing={3}>
      <PageSection title="Settings" subtitle="Account preferences and workspace defaults">
        <Paper className="settings-panel" variant="outlined">
          <Stack spacing={2}>
            <TextField label="Display name" defaultValue="Nguyen Anh" fullWidth />
            <TextField label="Default startup page" defaultValue="/chat" fullWidth />
            <Divider />
            <FormControlLabel 
              control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />} 
              label="Enable dark mode" 
            />
            <FormControlLabel control={<Switch defaultChecked />} label="Auto attach recent documents" />
            <FormControlLabel control={<Switch />} label="Enable desktop notifications" />
          </Stack>
        </Paper>
      </PageSection>

      <PageSection title="Security" subtitle="Cookie session and local workspace safety controls">
        <Paper className="settings-panel" variant="outlined">
          <Stack spacing={1}>
            <Typography variant="body2">JWT cookie mode: HttpOnly (recommended)</Typography>
            <Typography variant="body2" color="text.secondary">
              OAuth and session timeout values are centrally controlled in backend policy.
            </Typography>
          </Stack>
        </Paper>
      </PageSection>
    </Stack>
  )
}
