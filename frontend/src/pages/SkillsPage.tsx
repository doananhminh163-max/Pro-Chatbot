import { useState, type FormEvent } from 'react'
import { Download, Info, Trash2, X } from 'lucide-react'
import { findExternalSkills, getSkillDetail, installGlobalSkill, removeSkill } from '../services/appDataService'
import type { AppState, ExternalSkillFindResult, SkillDetail } from '../types/appData'
import { EmptyState, StatusBadge } from '../components/common/Primitives'

export function SkillsPage({ data, onRefresh }: { data: AppState; onRefresh: () => void }) {
  const [skillName, setSkillName] = useState('')
  const [result, setResult] = useState<ExternalSkillFindResult | null>(null)
  const [detail, setDetail] = useState<SkillDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeSkillName, setActiveSkillName] = useState<string | null>(null)
  const [installingPackage, setInstallingPackage] = useState<string | null>(null)
  const [installMessage, setInstallMessage] = useState<string | null>(null)
  const loadingSkills = data.skills.filter((skill) => skill.status === 'loading')
  const loadingSkillNames = loadingSkills.slice(0, 4).map((skill) => skill.name).join(', ')
  const loadingSkillSuffix = loadingSkills.length > 4 ? ` and ${loadingSkills.length - 4} more` : ''

  const handleFind = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = skillName.trim()
    if (!trimmed || loading) return
    setLoading(true)
    setError(null)
    setInstallMessage(null)
    setResult(null)
    try {
      setResult(await findExternalSkills(trimmed))
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to find skills')
    } finally {
      setLoading(false)
    }
  }

  const handleInstallGlobal = async (packageId: string) => {
    setInstallingPackage(packageId)
    setError(null)
    setInstallMessage(null)
    try {
      const installResult = await installGlobalSkill(packageId)
      setInstallMessage(`Installed globally: ${installResult.packageId}`)
      await onRefresh()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to install global skill')
    } finally {
      setInstallingPackage(null)
    }
  }

  const handleShowDetail = async (name: string) => {
    setActiveSkillName(name)
    setError(null)
    setDetail(null)
    try {
      setDetail(await getSkillDetail(data.project.id, name))
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load skill detail')
    } finally {
      setActiveSkillName(null)
    }
  }

  const handleRemove = async (name: string) => {
    if (!window.confirm(`Remove skill "${name}"?`)) return
    setActiveSkillName(name)
    setError(null)
    try {
      await removeSkill(data.project.id, name)
      if (detail?.name === name) setDetail(null)
      setInstallMessage(`Removed skill: ${name}`)
      await onRefresh()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to remove skill')
    } finally {
      setActiveSkillName(null)
    }
  }

  return (
    <div className="page-stack">
      {loadingSkills.length > 0 && (
        <div className="status-note warning">
          {loadingSkillNames}{loadingSkillSuffix} {loadingSkills.length === 1 ? 'is' : 'are'} installed on disk but OpenCode has not exposed {loadingSkills.length === 1 ? 'it' : 'them'} through the runtime API yet. The list will update after OpenCode finishes loading or after the server restarts.
        </div>
      )}

      {data.skills.length > 0 ? (
        <div className="card-grid">
          {data.skills.map((skill) => (
            <SkillCard
              disabled={activeSkillName === skill.name}
              removable={isRemovableSkill(skill, data.project.rootPath)}
              skill={skill}
              key={`${skill.source}-${skill.name}`}
              onRemove={handleRemove}
              onShowDetail={handleShowDetail}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No skills found" detail="No SKILL.md file was found in project or global skill directories." />
      )}

      {error && <div className="data-state error compact">{error}</div>}
      {installMessage && <div className="success-banner">{installMessage}</div>}
      {detail && <SkillDetailModal detail={detail} onClose={() => setDetail(null)} />}

      <section className="skill-find-panel" aria-label="Find external skills">
        <form className="skill-find-form" onSubmit={handleFind}>
          <input
            value={skillName}
            placeholder="Find skills by name"
            onChange={(event) => setSkillName(event.target.value)}
          />
          <button type="submit" disabled={loading || !skillName.trim()}>
            {loading ? 'finding...' : 'find'}
          </button>
        </form>
        {result && (
          <div className="skill-find-result">
            <span>{result.command}</span>
            {result.items.length > 0 && (
              <div className="external-skill-list">
                {result.items.map((item) => (
                  <article className="external-skill-row" key={item.package}>
                    <div>
                      <strong>{item.name}</strong>
                      <small>{item.package}</small>
                      {item.url && <a href={item.url} target="_blank" rel="noreferrer">{item.url}</a>}
                    </div>
                    <span>{item.installs}</span>
                    <button
                      className="toolbar-button accent"
                      type="button"
                      disabled={installingPackage === item.package}
                      onClick={() => void handleInstallGlobal(item.package)}
                    >
                      <Download size={16} />
                      <span>{installingPackage === item.package ? 'installing...' : 'Install'}</span>
                    </button>
                  </article>
                ))}
              </div>
            )}
            <pre>{result.stdout || result.stderr || 'No results returned.'}</pre>
          </div>
        )}
      </section>
    </div>
  )
}

function SkillCard({
  disabled,
  removable,
  skill,
  onRemove,
  onShowDetail,
}: {
  disabled: boolean
  removable: boolean
  skill: AppState['skills'][number]
  onRemove: (name: string) => Promise<void>
  onShowDetail: (name: string) => Promise<void>
}) {
  return (
    <article className={`data-card skill-card ${skill.status === 'loading' ? 'pending-runtime' : ''}`}>
      <div className="skill-card-main">
        <h3>{skill.name}</h3>
        <div className="metadata-row">
          <StatusBadge tone={skillStatusTone(skill.status)} label={skill.status} />
        </div>
      </div>
      <div className="card-actions">
        <button type="button" aria-label={`Show ${skill.name} detail`} title="Show Detail" disabled={disabled} onClick={() => void onShowDetail(skill.name)}>
          <Info size={16} />
        </button>
        <button
          className="danger-action"
          type="button"
          aria-label={`Remove ${skill.name}`}
          title={removable ? 'Remove' : 'Only project and user global skills can be removed'}
          disabled={disabled || !removable}
          onClick={() => void onRemove(skill.name)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  )
}

function isRemovableSkill(skill: AppState['skills'][number], projectRoot: string) {
  const source = normalizePath(skill.source)
  const project = normalizePath(projectRoot)
  return [
    `${project}/.opencode/skills/`,
    `${project}/.agents/skills/`,
    '/.config/opencode/skills/',
    '/.agents/skills/',
  ].some((root) => source.includes(root))
}

function normalizePath(input: string) {
  return input.replaceAll('\\', '/').replace(/\/+$/, '')
}

function skillStatusTone(status: string) {
  if (status === 'available' || status === 'valid') return 'success'
  if (status === 'loading' || status === 'needs review') return 'warning'
  return 'info'
}

function SkillDetailModal({ detail, onClose }: { detail: SkillDetail; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="skill-detail-modal" role="dialog" aria-modal="true" aria-labelledby="skill-detail-title">
        <button className="icon-button" type="button" aria-label="Close skill detail" onClick={onClose}>
          <X size={18} />
        </button>
        <div>
          <span>Skill detail</span>
          <h3 id="skill-detail-title">{detail.name}</h3>
        </div>
        <small className="path-text">{detail.sourcePath}</small>
        <pre>{detail.bodyPreview || 'No preview available.'}</pre>
      </section>
    </div>
  )
}
