import AdminCrudTable from '../../components/AdminCrudTable'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'version', label: 'Version' },
  { key: 'status', label: 'Status' },
]

const rows = [
  {
    id: 'mcp1',
    name: 'filesystem-context',
    description: 'Structured context from local documents and folders',
    version: '2.2.1',
    status: 'Active',
  },
  {
    id: 'mcp2',
    name: 'web-scraper-context',
    description: 'External context via controlled internet lookup',
    version: '1.8.5',
    status: 'Active',
  },
  {
    id: 'mcp3',
    name: 'legacy-connector',
    description: 'Backward compatibility connector for old sessions',
    version: '0.7.2',
    status: 'Degraded',
  },
]

export default function McpsPage() {
  return (
    <AdminCrudTable
      title="MCPs"
      subtitle="Control model context protocols, linking logic, and availability"
      columns={columns}
      rows={rows}
      addLabel="Add MCP"
    />
  )
}
