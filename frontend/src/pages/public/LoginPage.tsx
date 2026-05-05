import { useEffect, useMemo, useState } from 'react'
import { isAxiosError } from 'axios'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import GoogleIcon from '@mui/icons-material/Google'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getDefaultRouteForRole, getGoogleOAuthUrl } from '../../services/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)

    if (searchParams.get('oauth') === 'failed') {
      setError('Google OAuth failed. Please try again.')
    }
  }, [location.search])

  const canSubmit = useMemo(
    () => emailOrUsername.trim().length > 0 && password.trim().length > 0,
    [emailOrUsername, password],
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) {
      setError('Please provide account and password before sign in.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      const profile = await signIn({ emailOrUsername, password })
      navigate(getDefaultRouteForRole(profile.role), { replace: true })
    } catch (requestError) {
      if (isAxiosError<{ message?: string }>(requestError)) {
        setError(requestError.response?.data?.message ?? 'Sign in failed. Please check credentials.')
        return
      }

      setError('Unexpected error while signing in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleOAuth = () => {
    window.location.assign(getGoogleOAuthUrl())
  }

  return (
    <Box className="auth-shell">
      <Paper className="auth-card" elevation={0}>
        <Stack spacing={1} sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="h3">Welcome Back</Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit} className="auth-form">
          <Stack spacing={2}>
            {error ? <Alert severity="error">{error}</Alert> : null}

            <TextField
              autoFocus
              label="Email or Username"
              value={emailOrUsername}
              onChange={(event) => setEmailOrUsername(event.target.value)}
              fullWidth
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
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

            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={<Checkbox size="small" />}
                label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Remember me</Typography>}
              />
              <Link
                component={RouterLink}
                to="/forgot-password"
                underline="hover"
                color="primary"
                sx={{ fontSize: '0.85rem' }}
              >
                Forgot password?
              </Link>
            </Stack>

            <Button type="submit" variant="contained" size="large" disabled={!canSubmit || isSubmitting}>
              Sign In
            </Button>

            <Divider>or continue with</Divider>

            <Button
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleOAuth}
              disabled={isSubmitting}
            >
              Google OAuth
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'right' }}>
          No account yet?{' '}
          <Link component={RouterLink} to="/register" underline="hover">
            Create one
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}
