import assert from 'node:assert/strict';
import test from 'node:test';
import { appendPendingPermissionPrompts, permissionPromptFromRecord } from '../opencode-control.service.js';

test('permissionPromptFromRecord maps pattern based permission records into a chat prompt', () => {
  const prompt = permissionPromptFromRecord({
    id: 'per_123',
    sessionID: 'ses_123',
    permission: 'bash',
    patterns: ['git status --short'],
    metadata: {},
    always: ['git status *'],
    tool: {
      messageID: 'msg_123',
      callID: 'tool_123',
    },
  });

  assert.deepEqual(prompt, {
    id: 'per_123',
    sessionId: 'ses_123',
    permission: 'bash',
    title: 'Bash git status --short',
    detail: 'git status --short',
    patterns: ['git status --short'],
    metadata: {},
    tool: {
      messageId: 'msg_123',
      callId: 'tool_123',
    },
    always: ['git status *'],
    status: 'pending',
  });
});

test('permissionPromptFromRecord summarizes arbitrary permission metadata without known tool cases', () => {
  const prompt = permissionPromptFromRecord({
    id: 'per_custom',
    sessionID: 'ses_123',
    permission: 'mcp.invoke',
    patterns: [],
    metadata: {
      server: 'docs',
      action: 'search',
      input: { query: 'snapshot backup' },
    },
    always: [],
  });

  assert.deepEqual(prompt, {
    id: 'per_custom',
    sessionId: 'ses_123',
    permission: 'mcp.invoke',
    title: 'Mcp Invoke server: docs',
    detail: 'server: docs\naction: search\ninput: {"query":"snapshot backup"}',
    patterns: [],
    metadata: {
      server: 'docs',
      action: 'search',
      input: { query: 'snapshot backup' },
    },
    always: [],
    status: 'pending',
  });
});

test('appendPendingPermissionPrompts adds pending prompts to the latest assistant message', () => {
  const messages = appendPendingPermissionPrompts([
    {
      id: 'msg_user',
      sessionId: 'ses_123',
      role: 'user',
      content: '/review',
      createdAt: '2026-05-22T01:00:00.000Z',
    },
    {
      id: 'msg_assistant',
      sessionId: 'ses_123',
      role: 'assistant',
      content: '',
      parts: [{ type: 'text', text: '' }],
      createdAt: '2026-05-22T01:00:01.000Z',
    },
  ], [
    {
      id: 'per_123',
      sessionId: 'ses_123',
      permission: 'bash',
      title: 'Bash git status --short',
      detail: 'git status --short',
      patterns: ['git status --short'],
      metadata: {},
      always: ['git status *'],
      status: 'pending',
    },
  ]);

  assert.equal(messages.length, 2);
  assert.deepEqual(messages[1].parts?.at(-1), {
    type: 'permission_prompt',
    text: 'Bash git status --short',
    id: 'per_123',
    sessionId: 'ses_123',
    permission: 'bash',
    title: 'Bash git status --short',
    detail: 'git status --short',
    patterns: ['git status --short'],
    metadata: {},
    always: ['git status *'],
    status: 'pending',
  });
});
