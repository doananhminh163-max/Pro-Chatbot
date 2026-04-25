import { useState } from 'react'
import { isAxiosError } from 'axios'
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ForgotPasswordPage() {
  const { forgotPasswordFlow } = useAuth()
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!emailOrUsername.trim()) {
      setError('Please enter your email or username.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      const response = await forgotPasswordFlow({ emailOrUsername })
      setMessage(response.message)
    } catch (requestError) {
      if (isAxiosError<{ message?: string }>(requestError)) {
        setError(requestError.response?.data?.message ?? 'Unable to process forgot password request.')
      } else {
        setError('Unexpected error while processing forgot password request.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box className="auth-shell">
      <Paper className="auth-card" elevation={0}>
        <Stack spacing={1} sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontSize: '2.4rem', fontWeight: 600 }}>
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your email or username to get reset token
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit} className="auth-form">
          <Stack spacing={2}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {message ? <Alert severity="success">{message}</Alert> : null}

            <TextField
              autoFocus
              label="Email or Username"
              value={emailOrUsername}
              onChange={(event) => setEmailOrUsername(event.target.value)}
              fullWidth
            />

            <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
              Send Reset Request
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'right' }}>
          Back to{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            Sign in
          </Link>
          {' '}or{' '}
          <Link component={RouterLink} to="/reset-password" underline="hover">
            Reset password
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}
