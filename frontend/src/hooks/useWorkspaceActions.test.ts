import assert from 'node:assert/strict'
import test from 'node:test'
import { createWorkspaceActionHandlers } from './workspaceActionHandlers.ts'
import type { ConfigChange } from '../types/appData.ts'

test('createAgentProposal builds a read-only agent proposal from prompt answers', async () => {
  const prompts = ['reviewer', 'Reviews code', 'Only report findings']
  const createdAgents: Array<{ projectId: string; body: Record<string, unknown> }> = []
  const change = { id: 'chg_1' } as ConfigChange
  const runResults: unknown[] = []

  const actions = createWorkspaceActionHandlers({
    api: {
      createAgent: async (projectId, body) => {
        createdAgents.push({ projectId, body })
        return change
      },
      createCommand: async () => undefined,
      createMcpServer: async () => change,
      importSkill: async () => change,
      installMarketplaceSkill: async () => change,
      previewConfigPatch: async () => change,
      previewPermissionUpdate: async () => change,
    },
    projectId: 'prj_1',
    prompt: () => prompts.shift() ?? null,
    runAction: async (action) => {
      runResults.push(await action())
    },
    setActionError: () => {},
  })

  await actions.createAgentProposal()

  assert.equal(runResults[0], change)
  assert.deepEqual(createdAgents, [{
    projectId: 'prj_1',
    body: {
      name: 'reviewer',
      description: 'Reviews code',
      mode: 'subagent',
      permission: { read: 'allow', grep: 'allow', glob: 'allow', edit: 'deny', bash: 'deny' },
      prompt: 'Only report findings',
    },
  }])
})
