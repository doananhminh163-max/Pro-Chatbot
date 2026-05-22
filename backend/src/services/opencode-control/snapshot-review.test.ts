import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import {
  buildSnapshotReviewCleanupTargets,
  filterVisibleSnapshotReviewFiles,
  snapshotReviewRestoreTargets,
} from '../opencode-control.service.js';

test('filterVisibleSnapshotReviewFiles hides dismissed snapshot ids without mutating the source list', () => {
  const files = [
    { id: 'ses_1:msg_1:a.ts', path: 'a.ts' },
    { id: 'ses_1:msg_1:b.ts', path: 'b.ts' },
  ];
  const dismissedIds = new Set(['ses_1:msg_1:a.ts']);

  const visible = filterVisibleSnapshotReviewFiles(files, dismissedIds);

  assert.deepEqual(visible.map((file) => file.id), ['ses_1:msg_1:b.ts']);
  assert.equal(files.length, 2);
});

test('buildSnapshotReviewCleanupTargets only targets OpenCode snapshot and session diff storage', () => {
  const targets = buildSnapshotReviewCleanupTargets({
    openCodeDataDir: path.join('C:', 'Users', 'Admin', '.local', 'share', 'opencode'),
    projectId: 'project_123',
    sessionIds: ['ses_1', 'ses_1', 'ses_2'],
    includeProjectSnapshot: true,
    stateDirectory: path.join('D:', 'repo', '.pro-chatbot'),
  });

  assert.equal(targets.sessionDiffFiles.length, 2);
  assert.ok(targets.sessionDiffFiles.every((file) => file.endsWith('.json')));
  assert.equal(targets.projectSnapshotDir, path.join('C:', 'Users', 'Admin', '.local', 'share', 'opencode', 'snapshot', 'project_123'));
  assert.deepEqual(targets.appBackupDirs, []);
});

test('buildSnapshotReviewCleanupTargets keeps app backup dirs when only selected snapshots are cleared', () => {
  const targets = buildSnapshotReviewCleanupTargets({
    openCodeDataDir: path.join('C:', 'Users', 'Admin', '.local', 'share', 'opencode'),
    projectId: 'project_123',
    sessionIds: ['ses_1'],
    includeProjectSnapshot: false,
    stateDirectory: path.join('D:', 'repo', '.pro-chatbot'),
  });

  assert.equal(targets.projectSnapshotDir, undefined);
  assert.deepEqual(targets.appBackupDirs, []);
});

test('snapshotReviewRestoreTargets deduplicates by session and restores the earliest selected message', () => {
  const targets = snapshotReviewRestoreTargets([
    {
      sessionId: 'ses_1',
      messageId: 'msg_later',
      messageCreatedAt: '2026-05-21T10:00:00.000Z',
    },
    {
      sessionId: 'ses_1',
      messageId: 'msg_earlier',
      messageCreatedAt: '2026-05-21T09:00:00.000Z',
    },
    {
      sessionId: 'ses_2',
      messageId: 'msg_only',
      messageCreatedAt: '2026-05-21T11:00:00.000Z',
    },
  ]);

  assert.deepEqual(targets, [
    {
      sessionId: 'ses_1',
      messageId: 'msg_earlier',
      messageCreatedAt: '2026-05-21T09:00:00.000Z',
    },
    {
      sessionId: 'ses_2',
      messageId: 'msg_only',
      messageCreatedAt: '2026-05-21T11:00:00.000Z',
    },
  ]);
});
