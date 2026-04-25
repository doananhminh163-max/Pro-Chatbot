import { useMemo, useState } from 'react'
import { isAxiosError } from 'axios'
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'


export default function RegisterPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email])
  const usernameValid = useMemo(() => username.trim().length >= 3, [username])
  const passwordMatched = useMemo(() => password.length > 0 && password === confirmPassword, [password, confirmPassword])
  const canSubmit = emailValid && usernameValid && password.length >= 8 && passwordMatched

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) {
      setError('Please complete all fields with valid values before registering.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      await signUp({
        username,
        email,
        password,
      })
      navigate('/dashboard')
    } catch (requestError) {
      if (isAxiosError<{ message?: string }>(requestError)) {
        setError(requestError.response?.data?.message ?? 'Register failed. Please try again.')
        return
      }

      setError('Unexpected error while registering.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box className="auth-shell">
      <Paper className="auth-card" elevation={0}>
        <Stack spacing={1.5} sx={{ textAlign: 'center' }}>
          <Typography variant="h3">Register</Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit} className="auth-form">
          <Stack spacing={2}>
            {error ? <Alert severity="error">{error}</Alert> : null}

            <TextField
              autoFocus
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              helperText={username ? (usernameValid ? 'Username available.' : 'At least 3 characters.') : ' '}
              color={usernameValid ? 'success' : 'primary'}
            />

            <TextField
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              helperText={email ? (emailValid ? 'Email format valid.' : 'Invalid email format.') : ' '}
              color={emailValid ? 'success' : 'primary'}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              helperText={password && password.length < 8 ? 'At least 8 characters.' : ' '}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label="Toggle password visibility"
                        className="icon-reset-button"
                      >
                        {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                      </button>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              helperText={confirmPassword ? (passwordMatched ? 'Password matched.' : 'Password does not match.') : ' '}
              color={passwordMatched ? 'success' : 'primary'}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label="Toggle confirm password visibility"
                        className="icon-reset-button"
                      >
                        {showConfirmPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                      </button>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button type="submit" variant="contained" size="large" disabled={!canSubmit || isSubmitting}>
              Register
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'right' }}>
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}
