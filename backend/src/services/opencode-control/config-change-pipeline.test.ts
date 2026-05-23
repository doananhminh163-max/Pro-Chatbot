import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { applyConfigChange, previewConfigChange } from './config-change-pipeline.js';

test('config patch preview applies through the pipeline with a backup', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'config-change-pipeline-'));
  const previousProjectRoot = process.env.PROJECT_ROOT;
  process.env.PROJECT_ROOT = root;

  try {
    await writeFile(path.join(root, 'opencode.json'), `${JSON.stringify({ server: { port: 9 } }, null, 2)}\n`, 'utf8');
    await writeFile(path.join(root, 'settings.json'), `${JSON.stringify({ model: 'old/model' }, null, 2)}\n`, 'utf8');

    const change = await previewConfigChange('default', {
      targetFile: 'settings.json',
      patch: { model: 'new/model' },
      summary: 'Switch model',
    });

    assert.equal(change.status, 'previewed');
    assert.equal(change.targetFile, 'settings.json');
    assert.match(change.diff, /old\/model/);
    assert.match(change.diff, /new\/model/);

    const result = await applyConfigChange(change.id, { confirmed: true });

    assert.equal(result.status, 'applied');
    assert.equal(result.backups.length, 1);
    assert.equal(JSON.parse(await readFile(path.join(root, 'settings.json'), 'utf8')).model, 'new/model');
    assert.match(await readFile(result.backups[0].backupPath, 'utf8'), /old\/model/);
  } finally {
    if (previousProjectRoot === undefined) {
      delete process.env.PROJECT_ROOT;
    } else {
      process.env.PROJECT_ROOT = previousProjectRoot;
    }
    await rm(root, { recursive: true, force: true });
  }
});
