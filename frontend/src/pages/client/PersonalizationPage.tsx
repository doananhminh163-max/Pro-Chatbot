import { useState, useEffect } from 'react'
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import PageSection from '../../components/PageSection'
import { useAuth } from '../../hooks/useAuth'

export default function PersonalizationPage() {
  const { user, saveProfile } = useAuth()
  const [isSaving, setIsSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [aiTone, setAiTone] = useState('professional')
  const [aiLanguage, setAiLanguage] = useState('Vietnamese')
  const [aiResponseLength, setAiResponseLength] = useState('balanced')
  const [customInstructions, setCustomInstructions] = useState('')

  useEffect(() => {
    if (user?.personalization) {
      setAiTone(user.personalization.aiTone || 'professional')
      setAiLanguage(user.personalization.aiLanguage || 'Vietnamese')
      setAiResponseLength(user.personalization.aiResponseLength || 'balanced')
      setCustomInstructions(user.personalization.customInstructions || '')
    }
  }, [user])

  const handleSave = async () => {
    setIsSending(true)
    setSuccess(false)
    setError('')

    try {
      await saveProfile({
        aiTone,
        aiLanguage,
        aiResponseLength,
        customInstructions,
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Failed to save personalization settings.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Stack spacing={3}>
      <PageSection 
        title="Personalization" 
        subtitle="Customize how AI interacts with you and shapes its responses"
      >
        <Paper className="settings-panel" variant="outlined">
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Response Style</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Configure the personality and tone of the AI across all sessions.
              </Typography>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>AI Tone</InputLabel>
                  <Select
                    value={aiTone}
                    label="AI Tone"
                    onChange={(e) => setAiTone(e.target.value)}
                  >
                    <MenuItem value="professional">Professional & Objective</MenuItem>
                    <MenuItem value="friendly">Friendly & Helpful</MenuItem>
                    <MenuItem value="concise">Concise & Direct</MenuItem>
                    <MenuItem value="creative">Creative & Enthusiastic</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Output Language</InputLabel>
                  <Select
                    value={aiLanguage}
                    label="Output Language"
                    onChange={(e) => setAiLanguage(e.target.value)}
                  >
                    <MenuItem value="Vietnamese">Tiếng Việt</MenuItem>
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Auto">Auto Detect</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Response Length</InputLabel>
                  <Select
                    value={aiResponseLength}
                    label="Response Length"
                    onChange={(e) => setAiResponseLength(e.target.value)}
                  >
                    <MenuItem value="short">Short (Key points only)</MenuItem>
                    <MenuItem value="balanced">Balanced (Standard)</MenuItem>
                    <MenuItem value="detailed">Detailed (In-depth analysis)</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" gutterBottom>Custom Instructions</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Add specific rules or context that AI should always keep in mind (e.g., "Always format data as tables").
              </Typography>
              <TextField
                multiline
                rows={4}
                fullWidth
                placeholder="Ex: I am a software engineer. Explain things technically. Use emojis occasionally."
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
              {error && <Alert severity="error" sx={{ mr: 'auto' }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mr: 'auto' }}>Settings saved!</Alert>}
              
              <Button
                variant="contained"
                startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveRoundedIcon />}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </PageSection>

      <PageSection title="Style Preview" subtitle="How your current settings might look in a real response">
        <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.default' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            "Based on your <strong>{aiTone}</strong> tone and <strong>{aiResponseLength}</strong> length preference, 
            I will now respond in <strong>{aiLanguage}</strong> while keeping your custom instructions in mind..."
          </Typography>
        </Paper>
      </PageSection>
    </Stack>
  )
}
