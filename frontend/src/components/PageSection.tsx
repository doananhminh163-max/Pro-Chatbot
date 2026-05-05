import { type ReactNode } from 'react'
import { Box, Paper, Stack, Typography } from '@mui/material'

interface PageSectionProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children?: ReactNode
}

export default function PageSection({ title, subtitle, action, children }: PageSectionProps) {
  return (
    <Paper className="page-section" elevation={0}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h6">{title}</Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {action}
      </Stack>
      {children ? <Box sx={{ mt: 2 }}>{children}</Box> : null}
    </Paper>
  )
}
