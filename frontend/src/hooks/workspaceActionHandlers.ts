import type { ActionHandlers } from '../types/actionHandlers'
import type { ConfigChange, MarketplaceItem } from '../types/appData'

export type WorkspaceActionApi = {
  createAgent: (projectId: string, body: {
    name: string
    description?: string
    mode?: string
    model?: string
    temperature?: number
    maxSteps?: number
    disable?: boolean
    tools?: Record<string, unknown>
    permission?: Record<string, unknown>
    taskPermission?: Record<string, unknown>
    topP?: number
    prompt?: string
  }) => Promise<ConfigChange>
  createCommand: (projectId: string, body: { name: string; description?: string; agent?: string; model?: string; template: string }) => Promise<unknown>
  createMcpServer: (projectId: string, body: Record<string, unknown>) => Promise<ConfigChange>
  importSkill: (projectId: string, body: { directoryName: string; content: string }) => Promise<ConfigChange>
  installMarketplaceSkill: (projectId: string, marketplaceSkillId: string, directoryName: string) => Promise<ConfigChange>
  previewConfigPatch: (projectId: string, patch: Record<string, unknown>) => Promise<ConfigChange>
  previewPermissionUpdate: (projectId: string, permission: Record<string, unknown>) => Promise<ConfigChange>
}

export type CreateWorkspaceActionHandlersInput = {
  api: WorkspaceActionApi
  projectId: string | undefined
  prompt: (message: string, defaultValue?: string) => string | null
  runAction: (action: () => Promise<ConfigChange | void>) => Promise<void>
  setActionError: (message: string) => void
}

export function createWorkspaceActionHandlers({
  api,
  projectId,
  prompt,
  runAction,
  setActionError,
}: CreateWorkspaceActionHandlersInput): ActionHandlers {
  return {
    createConfigProposal: async () => {
      await runAction(async () => {
        if (!projectId) return
        const rawPatch = prompt('JSON patch for opencode.json', '{ "model": "opencode/gpt-5" }')
        if (!rawPatch) return
        return api.previewConfigPatch(projectId, JSON.parse(rawPatch) as Record<string, unknown>)
      })
    },
    createAgentProposal: async () => {
      await runAction(async () => {
        if (!projectId) return
        const name = prompt('Agent name', 'review')
        if (!name) return
        const description = prompt('Agent description', 'Read-only code review agent') ?? 'Read-only code review agent'
        const agentPrompt = prompt('Agent prompt', 'Review code without editing files. Report findings clearly.') ?? ''
        return api.createAgent(projectId, {
          name,
          description,
          mode: 'subagent',
          permission: { read: 'allow', grep: 'allow', glob: 'allow', edit: 'deny', bash: 'deny' },
          prompt: agentPrompt,
        })
      })
    },
    updatePermissionProposal: async () => {
      await runAction(async () => {
        if (!projectId) return
        const tool = prompt('Tool name', 'bash')
        if (!tool) return
        const value = prompt('Permission value: allow, ask, deny', 'ask')
        if (!value) return
        return api.previewPermissionUpdate(projectId, { [tool]: value })
      })
    },
    importSkillProposal: async () => {
      await runAction(async () => {
        if (!projectId) return
        const directoryName = prompt('Skill directory/name', 'project-helper')
        if (!directoryName) return
        const description = prompt('Skill description', 'Project-specific workflow helper') ?? 'Project-specific workflow helper'
        const content = `---\nname: ${directoryName}\ndescription: ${description}\n---\n# ${directoryName}\n\nUse this skill for ${description.toLowerCase()}.\n`
        return api.importSkill(projectId, { directoryName, content })
      })
    },
    installMarketplaceProposal: async (item: MarketplaceItem) => {
      await runAction(async () => {
        if (!projectId || !item.id) {
          setActionError('Marketplace item id is not available.')
          return
        }
        return api.installMarketplaceSkill(projectId, item.id, item.name)
      })
    },
    createMcpProposal: async () => {
      await runAction(async () => {
        if (!projectId) return
        const name = prompt('MCP server name', 'context7')
        if (!name) return
        const url = prompt('Remote MCP URL', 'https://example.com/mcp')
        return api.createMcpServer(projectId, { name, type: url ? 'remote' : 'local', url, enabled: false })
      })
    },
    createCommandProposal: async () => {
      await runAction(async () => {
        if (!projectId) return
        const name = prompt('Command name', 'test')
        if (!name) return
        const template = prompt('Command template', 'Run the full test suite and summarize failures.')
        if (!template) return
        await api.createCommand(projectId, { name, description: `${name} command`, template })
      })
    },
  }
}
