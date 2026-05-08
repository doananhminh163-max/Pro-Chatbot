import { Paper, Stack, Typography } from '@mui/material'

export default function AdminMetricCard(props: {
  label: string
  value: string | number
  caption?: string
  accent?: 'cyan' | 'amber' | 'green' | 'red'
}) {
  const accentMap = {
    cyan: 'rgba(94, 230, 255, 0.18)',
    amber: 'rgba(255, 182, 72, 0.24)',
    green: 'rgba(61, 220, 151, 0.24)',
    red: 'rgba(255, 107, 122, 0.24)',
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        px: 2.25,
        py: 2,
        minHeight: 132,
        borderColor: accentMap[props.accent || 'cyan'],
        background: 'linear-gradient(180deg, rgba(18, 23, 36, 0.92), rgba(8, 12, 20, 0.96))',
      }}
    >
      <Stack spacing={1.1}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', letterSpacing: '0.16em' }}
        >
          {props.label}
        </Typography>
        <Typography variant="h4" sx={{ letterSpacing: '-0.05em', lineHeight: 1 }}>
          {props.value}
        </Typography>
        {props.caption ? (
          <Typography variant="body2" color="text.secondary">
            {props.caption}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  )
}
