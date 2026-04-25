import { Button, Grid, Paper, Stack, Typography } from '@mui/material'
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import StorageRoundedIcon from '@mui/icons-material/StorageRounded'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import StatCard from '../../components/StatCard'
import PageSection from '../../components/PageSection'

const usageByDay = [52, 77, 63, 88, 71, 96, 83]
const providerUsage = [
  { provider: 'Gemini CLI', value: 46 },
  { provider: 'OpenCode', value: 31 },
  { provider: 'Fallback', value: 23 },
]

function MiniBarChart({ values }: { values: number[] }) {
  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'flex-end' }} className="mini-chart">
      {values.map((value, index) => (
        <span key={`${value}-${index}`} style={{ height: `${value}%` }} className="mini-chart__bar" />
      ))}
    </Stack>
  )
}

export default function DashboardPage() {
  return (
    <Stack spacing={3}>
      <Grid container spacing={2.25}>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <StatCard
            label="Total Chats"
            value="1,248"
            helper="+16% vs last week"
            icon={<ForumOutlinedIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <StatCard
            label="Uploaded Files"
            value="326"
            helper="OCR done 95%"
            icon={<DescriptionOutlinedIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <StatCard
            label="Storage Used"
            value="8.4 GB"
            helper="42% of local limit"
            icon={<StorageRoundedIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <StatCard
            label="Favorite Agent"
            value="Coder Pro"
            helper="312 sessions"
            icon={<SmartToyOutlinedIcon />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.25}>
        <Grid size={{ xs: 12, xl: 7 }}>
          <PageSection title="Usage by day" subtitle="7-day interaction intensity">
            <Paper variant="outlined" className="chart-panel">
              <MiniBarChart values={usageByDay} />
            </Paper>
          </PageSection>
        </Grid>
        <Grid size={{ xs: 12, xl: 5 }}>
          <PageSection title="Provider Mix" subtitle="Current routing distribution">
            <Stack spacing={1.25}>
              {providerUsage.map((item) => (
                <Paper key={item.provider} variant="outlined" className="provider-row">
                  <Typography variant="body2">{item.provider}</Typography>
                  <Typography variant="h6">{item.value}%</Typography>
                </Paper>
              ))}
            </Stack>
          </PageSection>
        </Grid>
      </Grid>

      <PageSection title="Quick Actions" subtitle="One-click flows for core operations">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
          <Button variant="contained" startIcon={<AddCommentOutlinedIcon />}>
            New Chat
          </Button>
          <Button variant="outlined" startIcon={<UploadFileOutlinedIcon />}>
            Upload File
          </Button>
          <Button variant="outlined" startIcon={<AutoAwesomeOutlinedIcon />}>
            Create Agent Session
          </Button>
        </Stack>
      </PageSection>
    </Stack>
  )
}
