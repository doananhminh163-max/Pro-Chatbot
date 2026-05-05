import { useDeferredValue, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
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

function buildSearchableText(row: AdminRow, columns: AdminColumn[]) {
  return columns.map((column) => row[column.key]).join(' ').toLowerCase()
}

export default function AdminCrudTable({
  title,
  columns,
  rows,
  addLabel,
}: AdminCrudTableProps) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const filteredRows = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    return rows.filter((row) => {
      const matchesQuery = !normalizedQuery || buildSearchableText(row, columns).includes(normalizedQuery)

      return matchesQuery
    })
  }, [columns, deferredQuery, rows])

  const attentionRows = useMemo(
    () => rows.filter((row) => !['active', 'healthy', 'enabled'].includes(row.status.toLowerCase())).slice(0, 3),
    [rows],
  )

  return (
    <Stack spacing={3}>
      <PageSection
        title={title}
      >
        <Box className="admin-toolbar">
          <TextField
            fullWidth
            size="small"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Filter ${title.toLowerCase()}...`}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button variant="contained" startIcon={<AddRoundedIcon />}>
              {addLabel}
            </Button>
            <Button variant="outlined" color="error">
              Clear all
            </Button>
          </Stack>
        </Box>
      </PageSection>

      <Box className="admin-board-grid">
        <Paper variant="outlined" className="table-shell admin-table-shell">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.key}>{column.label}</TableCell>
                  ))}
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row, index) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {(index + 1).toString().padStart(2, '0')}
                      </Typography>
                    </TableCell>
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
                        <IconButton size="small" color="error" aria-label="Delete row">
                          <DeleteOutlineOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 2}>
                      <Box className="admin-table-empty">
                        <Typography variant="subtitle2">No matching records</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Refine the search query to surface a narrower slice of the control plane.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper variant="outlined" className="admin-insight-rail">
          <Stack spacing={2}>
            <Box>
              <Typography variant="overline" className="admin-insight-rail__eyebrow">
                Ops Notes
              </Typography>
              <Typography variant="h6">Attention Queue</Typography>
              <Typography variant="body2" color="text.secondary">
                A quick read of items that are not fully healthy, useful before wiring real CRUD and telemetry.
              </Typography>
            </Box>

            {attentionRows.length === 0 ? (
              <Box className="admin-insight-card">
                <Typography variant="subtitle2">Everything is nominal</Typography>
                <Typography variant="body2" color="text.secondary">
                  No mock entities are currently marked as degraded, warning, locked, or disabled.
                </Typography>
              </Box>
            ) : (
              attentionRows.map((row) => (
                <Box key={row.id} className="admin-insight-card">
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">{row[columns[0].key]}</Typography>
                    <Chip size="small" label={row.status} color={statusColor(row.status)} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    {row[columns[1]?.key] ?? 'No secondary metadata available.'}
                  </Typography>
                </Box>
              ))
            )}
          </Stack>
        </Paper>
      </Box>
    </Stack>
  )
}
