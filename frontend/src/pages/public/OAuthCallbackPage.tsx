import { useEffect, useState } from 'react'
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getDefaultRouteForRole } from '../../services/auth'

export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { refreshSession } = useAuth()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const errorCode = searchParams.get('error')

    if (errorCode) {
      setError('Google OAuth failed. Please try again.')
      setIsLoading(false)
      return
    }

    let isActive = true

    const finalizeOAuth = async () => {
      try {
        const profile = await refreshSession()

        if (!isActive) {
          return
        }

        if (profile) {
          navigate(getDefaultRouteForRole(profile.role), { replace: true })
          return
        }

        setError('Google OAuth completed but no authenticated session was established.')
      } catch {
        if (isActive) {
          setError('Unable to complete Google sign in.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void finalizeOAuth()

    return () => {
      isActive = false
    }
  }, [navigate, refreshSession, searchParams])

  return (
    <Box className="auth-shell">
      <Paper className="auth-card" elevation={0}>
        <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Typography variant="h4">Google Sign In</Typography>

          {isLoading ? (
            <>
              <CircularProgress size={32} />
              <Typography variant="body2" color="text.secondary">
                Completing OAuth session...
              </Typography>
            </>
          ) : null}

          {error ? (
            <>
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
              <Button variant="contained" onClick={() => navigate('/login', { replace: true })}>
                Back to login
              </Button>
            </>
          ) : null}
        </Stack>
      </Paper>
    </Box>
  )
}
