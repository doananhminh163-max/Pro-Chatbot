import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { readSnapshotReviewDismissals, writeSnapshotReviewDismissals } from './state-store.js';

test('snapshot review dismissals persist as sanitized local state', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'snapshot-dismissals-'));

  try {
    await writeSnapshotReviewDismissals({
      project_1: ['ses_1:msg_1:a.ts', 'ses_1:msg_1:a.ts', ''],
      '': ['ses_ignored:msg_ignored:a.ts'],
    }, root);

    assert.deepEqual(await readSnapshotReviewDismissals(root), {
      project_1: ['ses_1:msg_1:a.ts'],
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
