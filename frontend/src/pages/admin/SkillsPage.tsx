import AdminCrudTable from '../../components/AdminCrudTable'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'version', label: 'Version' },
  { key: 'status', label: 'Status' },
]

const rows = [
  {
    id: 's1',
    name: 'search_web',
    description: 'Search internet for out-of-document questions',
    version: '1.4.0',
    status: 'Active',
  },
  {
    id: 's2',
    name: 'read_file',
    description: 'Read local documents and parse text context',
    version: '1.1.3',
    status: 'Active',
  },
  {
    id: 's3',
    name: 'generate_report',
    description: 'Create markdown and office documents from prompt',
    version: '0.9.8',
    status: 'Warning',
  },
]

export default function SkillsPage() {
  return (
    <AdminCrudTable
      title="Skills"
      subtitle="Manage reusable capabilities attached to specialized agents"
      columns={columns}
      rows={rows}
      addLabel="Add Skill"
    />
  )
}
