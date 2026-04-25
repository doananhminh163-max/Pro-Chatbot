import {
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import PageSection from './PageSection'

interface AdminColumn {
  key: string
  label: string
}

interface AdminRow {
  id: string
  [key: string]: string
}

interface AdminCrudTableProps {
  title: string
  subtitle: string
  columns: AdminColumn[]
  rows: AdminRow[]
  addLabel: string
}

function statusColor(status: string) {
  const normalized = status.toLowerCase()

  if (normalized === 'active' || normalized === 'healthy' || normalized === 'enabled') {
    return 'success'
  }

  if (normalized === 'warning' || normalized === 'degraded') {
    return 'warning'
  }

  if (normalized === 'locked' || normalized === 'error' || normalized === 'disabled') {
    return 'error'
  }

  return 'default'
}

function CellValue({ value, field }: { value: string; field: string }) {
  if (field === 'status') {
    return <Chip label={value} size="small" color={statusColor(value)} />
  }

  return <Typography variant="body2">{value}</Typography>
}

export default function AdminCrudTable({
  title,
  subtitle,
  columns,
  rows,
  addLabel,
}: AdminCrudTableProps) {
  return (
    <PageSection
      title={title}
      subtitle={subtitle}
      action={
        <Button variant="contained" startIcon={<AddRoundedIcon />}>
          {addLabel}
        </Button>
      }
    >
      <Paper variant="outlined" className="table-shell">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.key}>{column.label}</TableCell>
                ))}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} hover>
                  {columns.map((column) => (
                    <TableCell key={`${row.id}-${column.key}`}>
                      <CellValue value={row[column.key]} field={column.key} />
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                      <IconButton size="small" aria-label="Edit row">
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" aria-label="Archive row">
                        <ArchiveOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" aria-label="Delete row">
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </PageSection>
  )
}
