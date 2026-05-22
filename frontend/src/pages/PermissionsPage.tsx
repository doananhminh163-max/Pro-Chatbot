import { GitPullRequest, SlidersHorizontal } from 'lucide-react'
import type { AppState } from '../types/appData'
import type { ActionHandlers } from '../types/actionHandlers'
import { EmptyState, RiskBadge, SearchBox } from '../components/common/Primitives'

export function PermissionsPage({ data, actions }: { data: AppState; actions: ActionHandlers }) {
  return (
    <div className="page-stack">
      <div className="toolbar">
        <SearchBox placeholder="Filter tools" />
        <button className="toolbar-button" type="button">
          <SlidersHorizontal size={17} />
          <span>Policy filters</span>
        </button>
        <button className="toolbar-button accent" type="button" onClick={actions.updatePermissionProposal}>
          <GitPullRequest size={17} />
          <span>Preview changes</span>
        </button>
      </div>
      {data.permissions.length > 0 ? (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Tool</th>
                <th>Project</th>
                <th>Global</th>
                <th>Effective</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {data.permissions.map((permission) => (
                <tr key={permission.tool}>
                  <td>
                    <strong>{permission.tool}</strong>
                  </td>
                  <td>{permission.project}</td>
                  <td>{permission.global}</td>
                  <td>{permission.effective}</td>
                  <td>
                    <RiskBadge risk={permission.risk} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No permissions declared" detail="The backend did not find a permission object in the workspace OpenCode config." />
      )}
    </div>
  )
}
