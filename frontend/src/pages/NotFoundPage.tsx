import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <Box className="auth-shell">
      <Paper className="auth-card" elevation={0}>
        <Stack spacing={1.25}>
          <Typography variant="h2">404</Typography>
          <Typography variant="h5">Page not found</Typography>
          <Typography variant="body2" color="text.secondary">
            This route does not exist in the current workspace map.
          </Typography>
          <Button component={RouterLink} to="/chat" variant="contained" sx={{ mt: 1 }}>
            Back to chatbot
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
