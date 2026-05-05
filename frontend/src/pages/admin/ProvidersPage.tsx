import AdminCrudTable from '../../components/AdminCrudTable'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'version', label: 'Version' },
]

const rows = [
  {
    id: 'p1',
    name: 'Google Gemini',
    description: 'Primary provider for multi-step reasoning and coding',
    version: 'gemini-3.1',
    status: 'Healthy',
  },
  {
    id: 'p2',
    name: 'OpenCode',
    description: 'Secondary provider for fallback and low-latency requests',
    version: 'opencode-latest',
    status: 'Healthy',
  },
  {
    id: 'p3',
    name: 'Local Legacy',
    description: 'Deprecated local model bridge for old sessions',
    version: 'legacy-0.9',
    status: 'Disabled',
  },
]

export default function ProvidersPage() {
  return (
    <AdminCrudTable
      title="Providers"
      columns={columns}
      rows={rows}
      addLabel="Add Provider"
    />
  )
}
