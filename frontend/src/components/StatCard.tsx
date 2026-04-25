import { type ReactNode } from 'react'
import { Paper, Stack, Typography } from '@mui/material'

interface StatCardProps {
  label: string
  value: string
  helper: string
  icon: ReactNode
}

export default function StatCard({ label, value, helper, icon }: StatCardProps) {
  return (
    <Paper className="stat-card" elevation={0}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4">{value}</Typography>
          <Typography variant="caption" color="text.secondary">
            {helper}
          </Typography>
        </Stack>
        <span className="stat-card__icon">{icon}</span>
      </Stack>
    </Paper>
  )
}
