import assert from 'node:assert/strict'
import test from 'node:test'
import { firstPendingPermissionPromptId, visibleRuntimeParts, type ChatRuntimePart } from './runtimeEvents.ts'

function permissionPrompt(id: string, status: 'pending' | 'responding' | 'answered'): ChatRuntimePart {
  return {
    id,
    sessionId: 'session-1',
    permission: 'bash',
    title: `Read file ${id}`,
    detail: `Read file ${id}`,
    patterns: [`file-${id}.ts`],
    metadata: {},
    always: [],
    status,
  }
}

function toolActivity(callId: string): ChatRuntimePart {
  return {
    id: `tool-${callId}`,
    callId,
    tool: 'read',
    title: `Read ${callId}`,
    status: 'running',
  }
}

test('visibleRuntimeParts shows only the first pending permission prompt while keeping tool events visible', () => {
  const tool = toolActivity('one')
  const firstPrompt = permissionPrompt('permission-1', 'pending')
  const secondPrompt = permissionPrompt('permission-2', 'pending')
  const activePermissionId = firstPendingPermissionPromptId([[tool, firstPrompt, secondPrompt]])

  assert.equal(activePermissionId, 'permission-1')
  assert.deepEqual(visibleRuntimeParts([tool, firstPrompt, secondPrompt], activePermissionId), [
    tool,
    firstPrompt,
  ])
})

test('visibleRuntimeParts advances to the next pending prompt after the current prompt is answered', () => {
  const firstPrompt = permissionPrompt('permission-1', 'responding')
  const secondPrompt = permissionPrompt('permission-2', 'pending')
  const activePermissionId = firstPendingPermissionPromptId([[firstPrompt, secondPrompt]])

  assert.equal(activePermissionId, 'permission-2')
  assert.deepEqual(visibleRuntimeParts([firstPrompt, secondPrompt], activePermissionId), [secondPrompt])
})
