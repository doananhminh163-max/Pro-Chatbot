import { useMemo, useState } from 'react'
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
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ResetPasswordPage() {
  const { resetPasswordFlow } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tokenFromQuery = searchParams.get('token') ?? ''

  const [token, setToken] = useState(tokenFromQuery)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const canSubmit = useMemo(
    () => token.trim().length > 0 && newPassword.length >= 8 && newPassword === confirmPassword,
    [confirmPassword, newPassword, token],
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) {
      setError('Please provide a valid token and matching new passwords (min 8 chars).')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      const response = await resetPasswordFlow({ token, newPassword })
      setMessage(response.message)
      setTimeout(() => navigate('/login'), 1400)
    } catch (requestError) {
      if (isAxiosError<{ message?: string }>(requestError)) {
        setError(requestError.response?.data?.message ?? 'Unable to reset password.')
      } else {
        setError('Unexpected error while resetting password.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box className="auth-shell">
      <Paper className="auth-card" elevation={0}>
        <Stack spacing={1} sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontSize: '2.4rem', fontWeight: 600 }}>Reset Password</Typography>
          <Typography variant="body2" color="text.secondary">
            Provide the reset token and set a new password.
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit} className="auth-form">
          <Stack spacing={2}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {message ? <Alert severity="success">{message}</Alert> : null}

            <TextField
              label="Reset token"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              fullWidth
            />
            <TextField
              label="New password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              fullWidth
            />
            <TextField
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              fullWidth
            />

            <Button type="submit" variant="contained" size="large" disabled={!canSubmit || isSubmitting}>
              Reset Password
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'right' }}>
          Need a token?{' '}
          <Link component={RouterLink} to="/forgot-password" underline="hover">
            Request forgot password
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}
