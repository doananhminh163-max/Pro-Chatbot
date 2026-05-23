import assert from 'node:assert/strict';
import test from 'node:test';
import { buildWorkspaceAppState } from './presenter.js';

test('buildWorkspaceAppState derives dashboard, badges, marketplace, and settings from collected data', () => {
  const state = buildWorkspaceAppState({
    audit: [{ action: 'git.M', target: 'src/app.ts', risk: 'medium', status: 'working-tree', time: 'now' }],
    agents: [],
    backupsCount: 2,
    backupsPath: 'D:/repo/.pro-chatbot/backups',
    commands: [],
    config: {
      files: [],
      previewPath: null,
      preview: '',
      parsedConfig: null,
      configPath: null,
      tuiConfigPath: null,
    },
    defaultOpenCodeBaseUrl: 'http://127.0.0.1:4097',
    generatedAt: '2026-05-23T00:00:00.000Z',
    localeTimestamp: '23/5/2026, 00:00:00',
    mcpServers: [],
    models: ['opencode/gpt-5'],
    openCodeConfig: null,
    openCodeProject: { id: 'prj_1', name: 'repo', rootPath: 'D:/repo' },
    openCodeServer: { value: 'Offline', detail: 'http://127.0.0.1:4097', tone: 'danger' },
    packageJson: { name: 'repo-package', version: '1.2.3' },
    permissions: [{ tool: 'bash', project: 'allow', global: 'deny', effective: 'allow', risk: 'high' }],
    platform: 'win32 x64',
    providers: [],
    quickActions: ['Scan permissions'],
    riskQueue: [],
    root: 'D:/repo',
    skills: [
      { name: 'global-helper', scope: 'global', source: 'C:/skills/global-helper', status: 'valid', risk: 'low', description: 'Global helper' },
      { name: 'project-helper', scope: 'project', source: 'D:/repo/.opencode/skills/project-helper', status: 'valid', risk: 'low', description: 'Project helper' },
    ],
  });

  assert.equal(state.project.packageName, 'repo-package');
  assert.equal(state.navBadges.permissions, 1);
  assert.equal(state.dashboard.metrics.find((metric) => metric.title === 'Config health')?.value, 'Missing');
  assert.equal(state.dashboard.metrics.find((metric) => metric.title === 'Backups')?.value, '2 snapshot(s)');
  assert.deepEqual(state.marketplace.map((item) => item.name), ['global-helper']);
  assert.equal(state.settings.find((item) => item.title === 'OpenCode server URL')?.value, 'http://127.0.0.1:4097');
});
