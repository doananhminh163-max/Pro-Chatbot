import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import { buildSnapshotReviewCleanupTargets, filterVisibleSnapshotReviewFiles } from '../opencode-control.service.js';

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
  assert.deepEqual(targets.appBackupDirs, [
    path.join('D:', 'repo', '.pro-chatbot', 'manual-backups'),
    path.join('D:', 'repo', '.pro-chatbot', 'chat-backups'),
  ]);
});
