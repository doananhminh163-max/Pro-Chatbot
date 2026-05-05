import AdminCrudTable from '../../components/AdminCrudTable'

const columns = [
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'storage', label: 'Storage Usage' },
]

const rows = [
  {
    id: 'u1',
    username: 'anhcoder',
    email: 'anhcoder@local.ai',
    status: 'Active',
    role: 'CLIENT',
    storage: '1.8 GB',
  },
  {
    id: 'u2',
    username: 'linhadmin',
    email: 'linhadmin@local.ai',
    status: 'Active',
    role: 'ADMIN',
    storage: '2.1 GB',
  },
  {
    id: 'u3',
    username: 'testlock',
    email: 'testlock@local.ai',
    status: 'Locked',
    role: 'CLIENT',
    storage: '0.3 GB',
  },
]

export default function UsersPage() {
  return (
    <AdminCrudTable
      title="User Management"
      columns={columns}
      rows={rows}
      addLabel="Create User"
    />
  )
}
