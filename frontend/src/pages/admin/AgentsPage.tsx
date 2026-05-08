import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import HubRoundedIcon from '@mui/icons-material/HubRounded'
import PsychologyAltRoundedIcon from '@mui/icons-material/PsychologyAltRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import PageSection from '../../components/PageSection'
import AdminMetricCard from '../../components/admin/AdminMetricCard'
import {
  createAdminAgent,
  deleteAdminAgent,
  fetchAdminAgents,
  updateAdminAgent,
  type AdminAgentAuditRecord,
  type AdminAgentRecord,
  type AdminMcpCatalogItem,
  type AdminSkillCatalogItem,
} from '../../services/admin'

interface AgentEditorState {
  name: string
  description: string
  systemPrompt: string
  selectedSkillIds: string[]
  selectedMcpToolIds: string[]
}

const DRAFT_AGENT_ID = '__draft__'

const runtimeDateFormatter = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function createEditorState(agent: AdminAgentRecord | null): AgentEditorState {
  return {
    name: agent?.name || '',
    description: agent?.description || '',
    systemPrompt: agent?.systemPrompt || '',
    selectedSkillIds: agent?.selectedSkillIds || [],
    selectedMcpToolIds: agent?.selectedMcpToolIds || [],
  }
}

function normalizeEditorState(state: AgentEditorState) {
  return {
    name: state.name,
    description: state.description,
    systemPrompt: state.systemPrompt,
    selectedSkillIds: [...state.selectedSkillIds].sort(),
    selectedMcpToolIds: [...state.selectedMcpToolIds].sort(),
  }
}

function formatRuntimeTime(value: string | null) {
  if (!value) {
    return 'No custom runtime overrides yet'
  }

  return runtimeDateFormatter.format(new Date(value))
}

function providerColor(provider: 'gemini' | 'opencode') {
  return provider === 'gemini' ? 'info' : 'warning'
}

function auditColor(action: 'CREATE' | 'UPDATE' | 'DELETE') {
  if (action === 'CREATE') return 'success'
  if (action === 'DELETE') return 'error'
  return 'warning'
}

function buildSearchIndex(parts: Array<string | null | undefined>) {
  return parts
    .filter((part): part is string => Boolean(part))
    .join(' ')
    .toLowerCase()
}

function matchesQuery(index: string, query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  return !normalizedQuery || index.includes(normalizedQuery)
}

function buildPromptExcerpt(prompt: string) {
  const normalized = prompt.replace(/\s+/g, ' ').trim()

  if (!normalized) {
    return 'No system prompt yet. Start with mission, boundaries, and escalation rules.'
  }

  if (normalized.length <= 180) {
    return normalized
  }

  return `${normalized.slice(0, 177)}...`
}

export default function AgentsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [agents, setAgents] = useState<AdminAgentRecord[]>([])
  const [skills, setSkills] = useState<AdminSkillCatalogItem[]>([])
  const [mcps, setMcps] = useState<AdminMcpCatalogItem[]>([])
  const [audit, setAudit] = useState<AdminAgentAuditRecord[]>([])
  const [selectedAgentId, setSelectedAgentId] = useState<string>('')
  const [editor, setEditor] = useState<AgentEditorState>(createEditorState(null))
  const [skillQuery, setSkillQuery] = useState('')
  const [mcpQuery, setMcpQuery] = useState('')

  const deferredSkillQuery = useDeferredValue(skillQuery)
  const deferredMcpQuery = useDeferredValue(mcpQuery)

  const loadWorkspace = async (preserveSelectedId?: string, keepDraft = false) => {
    setLoading(true)
    setError(null)

    try {
      const payload = await fetchAdminAgents()
      setAgents(payload.agents)
      setSkills(payload.skills)
      setMcps(payload.mcps)
      setAudit(payload.audit)

      if (keepDraft) {
        setSelectedAgentId(DRAFT_AGENT_ID)
        setIsCreating(true)
        setEditor((current) => current)
      } else {
        const preferredId = preserveSelectedId || selectedAgentId || payload.agents[0]?.id || ''
        const resolvedAgent = payload.agents.find((item) => item.id === preferredId) || payload.agents[0] || null
        setSelectedAgentId(resolvedAgent?.id || '')
        setIsCreating(false)
        setEditor(createEditorState(resolvedAgent))
      }
    } catch (loadError) {
      setError((loadError as Error).message || 'Failed to load agent workspace.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadWorkspace()
  }, [])

  const selectedAgent = useMemo(
    () => agents.find((item) => item.id === selectedAgentId) || null,
    [agents, selectedAgentId],
  )

  const baselineEditor = useMemo(
    () => createEditorState(isCreating ? null : selectedAgent),
    [isCreating, selectedAgent],
  )

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(normalizeEditorState(editor)) !== JSON.stringify(normalizeEditorState(baselineEditor)),
    [baselineEditor, editor],
  )

  const activeSkills = useMemo(
    () => skills.filter((item) => editor.selectedSkillIds.includes(item.id)),
    [editor.selectedSkillIds, skills],
  )

  const activeMcps = useMemo(
    () => mcps.filter((item) => editor.selectedMcpToolIds.includes(item.id)),
    [editor.selectedMcpToolIds, mcps],
  )

  const filteredSkills = useMemo(() => {
    return skills.filter((item) => matchesQuery(buildSearchIndex([item.name, item.description, item.path]), deferredSkillQuery))
  }, [deferredSkillQuery, skills])

  const filteredMcps = useMemo(() => {
    return mcps.filter((item) => matchesQuery(buildSearchIndex([item.name, item.provider, item.source, item.command]), deferredMcpQuery))
  }, [deferredMcpQuery, mcps])

  const totalLinkedSessions = useMemo(
    () => agents.reduce((sum, item) => sum + item.sessionCount, 0),
    [agents],
  )

  const promptLength = editor.systemPrompt.trim().length
  const capabilityCount = activeSkills.length + activeMcps.length
  const currentSessionCount = selectedAgent?.sessionCount || 0
  const promptExcerpt = buildPromptExcerpt(editor.systemPrompt)

  const highlightedAudit = useMemo(() => {
    if (isCreating || !selectedAgent) {
      return audit.slice(0, 6)
    }

    const scoped = audit.filter((entry) => entry.agentId === selectedAgent.id)
    return (scoped.length > 0 ? scoped : audit).slice(0, 6)
  }, [audit, isCreating, selectedAgent])

  const saveDisabled = saving || !editor.name.trim()
  const activeProfileValue = isCreating ? DRAFT_AGENT_ID : selectedAgentId

  const handleSelectAgent = (agent: AdminAgentRecord) => {
    startTransition(() => {
      setSelectedAgentId(agent.id)
      setIsCreating(false)
      setEditor(createEditorState(agent))
      setNotice(null)
    })
  }

  const handleStartCreate = () => {
    startTransition(() => {
      setSelectedAgentId(DRAFT_AGENT_ID)
      setIsCreating(true)
      setEditor(createEditorState(null))
      setNotice(null)
      setError(null)
      setDetailsOpen(true)
    })
  }

  const handleProfileChange = (value: string) => {
    if (value === DRAFT_AGENT_ID) {
      handleStartCreate()
      return
    }

    const nextAgent = agents.find((item) => item.id === value)
    if (nextAgent) {
      handleSelectAgent(nextAgent)
    }
  }

  const toggleSkill = (skillId: string) => {
    setEditor((current) => ({
      ...current,
      selectedSkillIds: current.selectedSkillIds.includes(skillId)
        ? current.selectedSkillIds.filter((item) => item !== skillId)
        : [...current.selectedSkillIds, skillId],
    }))
  }

  const toggleMcp = (mcpId: string) => {
    setEditor((current) => ({
      ...current,
      selectedMcpToolIds: current.selectedMcpToolIds.includes(mcpId)
        ? current.selectedMcpToolIds.filter((item) => item !== mcpId)
        : [...current.selectedMcpToolIds, mcpId],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setNotice(null)

    try {
      if (isCreating) {
        const created = await createAdminAgent({
          name: editor.name,
          description: editor.description,
          systemPrompt: editor.systemPrompt,
          selectedSkillIds: editor.selectedSkillIds,
          selectedMcpToolIds: editor.selectedMcpToolIds,
        })

        setNotice(`Agent ${created.name} created. Client sessions can now select this profile.`)
        await loadWorkspace(created.id)
        return
      }

      if (!selectedAgent) {
        return
      }

      const updated = await updateAdminAgent(selectedAgent.id, {
        name: editor.name,
        description: editor.description,
        systemPrompt: editor.systemPrompt,
        selectedSkillIds: editor.selectedSkillIds,
        selectedMcpToolIds: editor.selectedMcpToolIds,
      })

      setAgents((current) => current.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)))
      setNotice(`Agent ${updated.name} updated. New sessions using this agent will inherit the saved runtime.`)
      await loadWorkspace(updated.id)
    } catch (saveError) {
      setError((saveError as Error).message || 'Failed to save agent configuration.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedAgent || isCreating) {
      return
    }

    setDeleting(true)
    setError(null)
    setNotice(null)

    try {
      const removed = await deleteAdminAgent(selectedAgent.id)
      setNotice(`Agent ${removed.name} deleted. Existing sessions were detached from this profile.`)
      await loadWorkspace(undefined)
    } catch (deleteError) {
      setError((deleteError as Error).message || 'Failed to delete agent.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <Box className="admin-loading-shell">
        <CircularProgress size={28} />
      </Box>
    )
  }

  return (
    <Stack spacing={3.5} className="agent-foundry-page">
      <Box className="admin-summary-grid">
        <AdminMetricCard label="Agents" value={agents.length} caption="Profiles available for client sessions" accent="cyan" />
        <AdminMetricCard label="Skills" value={skills.length} caption="Discovered in the local skill catalog" accent="green" />
        <AdminMetricCard label="MCP Entries" value={mcps.length} caption="Tool endpoints collected from active providers" accent="amber" />
        <AdminMetricCard label="Linked Sessions" value={totalLinkedSessions} caption="Sessions currently attached to an agent profile" accent="red" />
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {notice ? <Alert severity="success">{notice}</Alert> : null}

      <PageSection
        title="Agent Foundry"
        subtitle="Compact by default. Expand only the parts you need to inspect or update."
        action={(
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshRoundedIcon />}
              onClick={() => void loadWorkspace(selectedAgentId, isCreating)}
            >
              Refresh Catalog
            </Button>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleStartCreate}>
              New Agent
            </Button>
          </Stack>
        )}
      >
        <Box className="agent-compact-hero">
          <Box>
            <Typography variant="overline" className="agent-foundry-label">
              Control Surface
            </Typography>
            <Typography variant="h4" className="agent-compact-hero__title">
              {isCreating ? 'Draft agent profile' : (selectedAgent?.name || 'Select an agent profile')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8, maxWidth: 720 }}>
              Use the dropdown to switch profiles. Open details only when you need to inspect prompt, skills, MCP tools, or audit history.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} useFlexGap className="agent-compact-hero__chips">
            <Chip
              icon={<CheckCircleRoundedIcon />}
              label={isCreating ? 'Draft workspace' : 'Saved profile'}
              color={isCreating ? 'default' : 'primary'}
              variant="outlined"
            />
            <Chip
              icon={<TuneRoundedIcon />}
              label={hasUnsavedChanges ? 'Unsaved changes' : 'Editor in sync'}
              color={hasUnsavedChanges ? 'warning' : 'success'}
              variant="outlined"
            />
            <Chip label={`${capabilityCount} linked modules`} variant="outlined" />
          </Stack>
        </Box>

        <Paper variant="outlined" className="agent-compact-shell">
          <Box className="agent-compact-shell__grid">
            <Stack spacing={1.5}>
              <TextField
                select
                fullWidth
                label="Agent profile"
                value={activeProfileValue}
                onChange={(event) => handleProfileChange(event.target.value)}
              >
                {isCreating ? <MenuItem value={DRAFT_AGENT_ID}>New agent draft</MenuItem> : null}
                {agents.map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </MenuItem>
                ))}
              </TextField>

              <Box className="agent-compact-profile">
                <Typography variant="subtitle1">
                  {isCreating ? (editor.name.trim() || 'New agent draft') : (selectedAgent?.name || 'No profile selected')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {editor.description || 'No description yet'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Last update: {isCreating ? 'Not saved yet' : formatRuntimeTime(selectedAgent?.updatedAt || null)}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                <Button variant="outlined" onClick={() => setDetailsOpen((current) => !current)}>
                  {detailsOpen ? 'Hide Detail' : 'Show Detail'}
                </Button>
                {!isCreating ? (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteOutlineRoundedIcon />}
                    onClick={() => void handleDelete()}
                    disabled={!selectedAgent || deleting || saving}
                  >
                    Delete
                  </Button>
                ) : null}
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveRoundedIcon />}
                  onClick={() => void handleSave()}
                  disabled={saveDisabled}
                >
                  {isCreating ? 'Create Agent' : 'Update'}
                </Button>
              </Stack>
            </Stack>

            <Box className="agent-compact-stats">
              <Box className="agent-compact-stat">
                <span>Attached sessions</span>
                <strong>{currentSessionCount}</strong>
              </Box>
              <Box className="agent-compact-stat">
                <span>Skills selected</span>
                <strong>{activeSkills.length}</strong>
              </Box>
              <Box className="agent-compact-stat">
                <span>MCP selected</span>
                <strong>{activeMcps.length}</strong>
              </Box>
              <Box className="agent-compact-stat">
                <span>Prompt footprint</span>
                <strong>{promptLength}</strong>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Collapse in={detailsOpen} timeout="auto" unmountOnExit={false}>
          <Stack spacing={2.25} sx={{ mt: 2.25 }}>
            <Paper variant="outlined" className="agent-compact-editor">
              <Stack spacing={2}>
                <Box>
                  <Typography variant="overline" className="agent-foundry-label">
                    Identity
                  </Typography>
                  <Typography variant="h6">Profile details</Typography>
                </Box>

                <Box className="admin-form-grid">
                  <TextField
                    label="Agent name"
                    value={editor.name}
                    onChange={(event) => setEditor((current) => ({ ...current, name: event.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Description"
                    value={editor.description}
                    onChange={(event) => setEditor((current) => ({ ...current, description: event.target.value }))}
                    fullWidth
                  />
                </Box>
              </Stack>
            </Paper>

            <Accordion disableGutters className="agent-compact-accordion" defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <PsychologyAltRoundedIcon fontSize="small" />
                  <Typography variant="subtitle1">Prompt Studio</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1.5}>
                  <Typography variant="body2" color="text.secondary">
                    Write mission, tone, guardrails, escalation thresholds, and preferred execution style here.
                  </Typography>
                  <TextField
                    label="System prompt"
                    value={editor.systemPrompt}
                    onChange={(event) => setEditor((current) => ({ ...current, systemPrompt: event.target.value }))}
                    fullWidth
                    multiline
                    minRows={10}
                    placeholder="Define mission, constraints, escalation rules, preferred tool use, and response style."
                  />
                  <Box className="agent-compact-note">
                    <Typography variant="overline">Prompt Excerpt</Typography>
                    <Typography variant="body2">{promptExcerpt}</Typography>
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion disableGutters className="agent-compact-accordion">
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <AutoAwesomeRoundedIcon fontSize="small" />
                  <Typography variant="subtitle1">Skills Catalog</Typography>
                  <Chip size="small" label={`${editor.selectedSkillIds.length} selected`} sx={{ ml: 1 }} />
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1.5}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Filter by name, description, or path"
                    value={skillQuery}
                    onChange={(event) => setSkillQuery(event.target.value)}
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

                  <Box className="admin-capability-list">
                    {filteredSkills.map((skill) => {
                      const selected = editor.selectedSkillIds.includes(skill.id)

                      return (
                        <button
                          key={skill.id}
                          type="button"
                          className={`admin-capability-card${selected ? ' is-selected' : ''}`}
                          onClick={() => toggleSkill(skill.id)}
                        >
                          <Stack spacing={1}>
                            <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                              <Box>
                                <Typography variant="subtitle2">{skill.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {skill.path}
                                </Typography>
                              </Box>
                              <Chip
                                size="small"
                                label={selected ? 'Enabled' : 'Enable'}
                                color={selected ? 'success' : 'default'}
                                variant={selected ? 'filled' : 'outlined'}
                              />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {skill.description}
                            </Typography>
                          </Stack>
                        </button>
                      )
                    })}

                    {filteredSkills.length === 0 ? (
                      <Box className="admin-table-empty">
                        <Typography variant="subtitle2">No matching skills</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Broaden the query or clear the filter to inspect the full catalog.
                        </Typography>
                      </Box>
                    ) : null}
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion disableGutters className="agent-compact-accordion">
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <HubRoundedIcon fontSize="small" />
                  <Typography variant="subtitle1">MCP Surface</Typography>
                  <Chip size="small" label={`${editor.selectedMcpToolIds.length} selected`} sx={{ ml: 1 }} />
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1.5}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Filter by name, provider, source, or command"
                    value={mcpQuery}
                    onChange={(event) => setMcpQuery(event.target.value)}
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

                  <Box className="admin-capability-list">
                    {filteredMcps.map((mcp) => {
                      const selected = editor.selectedMcpToolIds.includes(mcp.id)

                      return (
                        <button
                          key={mcp.id}
                          type="button"
                          className={`admin-capability-card${selected ? ' is-selected' : ''}`}
                          onClick={() => toggleMcp(mcp.id)}
                        >
                          <Stack spacing={1}>
                            <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                              <Box>
                                <Typography variant="subtitle2">{mcp.name}</Typography>
                                <Stack direction="row" spacing={0.75} useFlexGap sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                                  <Chip size="small" label={mcp.provider} color={providerColor(mcp.provider)} />
                                  <Chip size="small" label={mcp.source} variant="outlined" />
                                  {!mcp.enabled ? <Chip size="small" label="Disabled in source" variant="outlined" /> : null}
                                </Stack>
                              </Box>
                              <Chip
                                size="small"
                                label={selected ? 'Enabled' : 'Enable'}
                                color={selected ? 'success' : 'default'}
                                variant={selected ? 'filled' : 'outlined'}
                              />
                            </Stack>
                            <Typography variant="body2" className="admin-capability-card__command">
                              {mcp.command || 'No command preview available'}
                            </Typography>
                          </Stack>
                        </button>
                      )
                    })}

                    {filteredMcps.length === 0 ? (
                      <Box className="admin-table-empty">
                        <Typography variant="subtitle2">No matching MCP entries</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Clear the filter to inspect the full provider surface again.
                        </Typography>
                      </Box>
                    ) : null}
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion disableGutters className="agent-compact-accordion">
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <TuneRoundedIcon fontSize="small" />
                  <Typography variant="subtitle1">Bundle Manifest</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Box className="admin-bundle-groups">
                  <Box className="admin-bundle-group">
                    <Typography variant="overline" className="admin-bundle-group__label">Skills</Typography>
                    <Stack direction="row" spacing={0.75} useFlexGap sx={{ mt: 1, flexWrap: 'wrap' }}>
                      {activeSkills.map((skill) => (
                        <Chip key={skill.id} size="small" label={skill.name} color="success" variant="outlined" />
                      ))}
                      {activeSkills.length === 0 ? <Chip size="small" label="No skills selected" /> : null}
                    </Stack>
                  </Box>

                  <Box className="admin-bundle-group">
                    <Typography variant="overline" className="admin-bundle-group__label">MCP Entries</Typography>
                    <Stack direction="row" spacing={0.75} useFlexGap sx={{ mt: 1, flexWrap: 'wrap' }}>
                      {activeMcps.map((mcp) => (
                        <Chip key={mcp.id} size="small" label={`${mcp.provider}:${mcp.name}`} color={providerColor(mcp.provider)} variant="outlined" />
                      ))}
                      {activeMcps.length === 0 ? <Chip size="small" label="No MCPs selected" /> : null}
                    </Stack>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion disableGutters className="agent-compact-accordion">
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <HistoryRoundedIcon fontSize="small" />
                  <Typography variant="subtitle1">Audit Timeline</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  {highlightedAudit.map((entry) => (
                    <Box key={entry.id} className="agent-foundry-audit-card">
                      <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                        <Chip size="small" label={entry.action} color={auditColor(entry.action)} />
                        <Typography variant="subtitle2">{entry.agentName}</Typography>
                        <Typography variant="caption" color="text.secondary">{entry.actorEmail}</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                        {entry.summary}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
                        {formatRuntimeTime(entry.createdAt)}
                      </Typography>
                    </Box>
                  ))}

                  {highlightedAudit.length === 0 ? (
                    <Box className="admin-table-empty">
                      <Typography variant="subtitle2">No audit entries yet</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Agent changes will appear here after the first create, update, or delete event.
                      </Typography>
                    </Box>
                  ) : null}
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Collapse>
      </PageSection>
    </Stack>
  )
}
