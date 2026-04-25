import AdminCrudTable from '../../components/AdminCrudTable'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'version', label: 'Version' },
  { key: 'status', label: 'Status' },
]

const rows = [
  {
    id: 'a1',
    name: 'Coder Pro',
    description: 'Engineering assistant optimized for TS/React workflows',
    version: '3.0.0',
    status: 'Active',
  },
  {
    id: 'a2',
    name: 'Doc Analyst',
    description: 'Document Q&A specialist with OCR and RAG focus',
    version: '2.5.1',
    status: 'Active',
  },
  {
    id: 'a3',
    name: 'Ops Sentinel',
    description: 'Monitors system logs and incident traces',
    version: '1.3.2',
    status: 'Warning',
  },
]

export default function AgentsPage() {
  return (
    <AdminCrudTable
      title="Agents Config"
      subtitle="Configure specialized assistants and bind Skills/MCP capabilities"
      columns={columns}
      rows={rows}
      addLabel="Add Agent"
    />
  )
}
