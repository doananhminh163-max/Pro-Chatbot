import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildCommandFileParts,
  buildLegacyPromptParts,
  buildOpenCodePrompt,
  buildPromptFileAttachments,
  buildPromptReferenceAttachments,
  isOpenCodeV2PromptResponseValidationBug,
  mapOpenCodeCommandRecords,
  normalizeChatReference,
  normalizeChatReferences,
  shouldFallbackToLegacyPrompt,
} from '../opencode-control.service.js';
import type { ProjectRecord } from '../opencode-control/types.js';

async function tempProject() {
  const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), 'pro-chatbot-ref-'));
  const project: ProjectRecord = {
    id: 'project_ref',
    name: 'reference project',
    rootPath,
    configPath: null,
    tuiConfigPath: null,
    platform: 'test',
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  };
  return { project, rootPath };
}

test('mapOpenCodeCommandRecords keeps native skill command sources', () => {
  const commands = mapOpenCodeCommandRecords([
    { name: 'review', source: 'command', description: 'Review changes' },
    { name: 'frontend-design', source: 'skill', description: 'Design UI' },
    { name: '', source: 'skill' },
  ]);

  assert.deepEqual(commands.map((command) => `${command.source}:${command.name}`), [
    'command:review',
    'skill:frontend-design',
  ]);
});

test('normalizeChatReference rejects paths outside the project root', async () => {
  const { project, rootPath } = await tempProject();
  const outsidePath = path.join(path.dirname(rootPath), 'outside.txt');
  await fs.writeFile(outsidePath, 'outside', 'utf8');

  await assert.rejects(
    () => normalizeChatReference(project, { path: outsidePath, type: 'file' }),
    /Path is outside the project root/,
  );
});

test('normalizeChatReferences combines explicit references, legacy files, and message @paths', async () => {
  const { project, rootPath } = await tempProject();
  await fs.mkdir(path.join(rootPath, 'docs'));
  await fs.writeFile(path.join(rootPath, 'README.md'), '# readme', 'utf8');
  await fs.writeFile(path.join(rootPath, 'docs', 'notes.txt'), 'notes', 'utf8');

  const references = await normalizeChatReferences(project, 'Read @README.md and @docs/notes.txt', {
    references: [{ path: 'docs', type: 'directory' }],
    files: [{ path: 'README.md' }],
  });

  assert.deepEqual(references.map((reference) => `${reference.type}:${reference.relativePath}`), [
    'directory:docs',
    'file:README.md',
    'file:docs/notes.txt',
  ]);
});

test('buildPromptFileAttachments emits native PromptFileAttachment source data', async () => {
  const { project, rootPath } = await tempProject();
  await fs.writeFile(path.join(rootPath, 'README.md'), '# Title\n', 'utf8');
  const references = await normalizeChatReferences(project, '', {
    references: [{ path: 'README.md', type: 'file' }],
  });

  assert.deepEqual(await buildPromptFileAttachments(project, references), [{
    uri: path.join(rootPath, 'README.md'),
    mime: 'text/markdown',
    name: 'README.md',
    source: { start: 0, end: 8, text: '# Title\n' },
  }]);
});

test('buildPromptReferenceAttachments emits native local directory references', async () => {
  const { project, rootPath } = await tempProject();
  await fs.mkdir(path.join(rootPath, 'docs'));
  const references = await normalizeChatReferences(project, '', {
    references: [{ path: 'docs', type: 'directory' }],
  });

  assert.deepEqual(buildPromptReferenceAttachments(project, references), [{
    name: 'docs',
    kind: 'local',
    uri: path.join(rootPath, 'docs'),
    target: 'docs',
    targetUri: path.join(rootPath, 'docs'),
    source: { start: 0, end: 0, text: '@docs' },
  }]);
});

test('buildCommandFileParts rejects directory references deterministically', async () => {
  const { project, rootPath } = await tempProject();
  await fs.mkdir(path.join(rootPath, 'docs'));
  const references = await normalizeChatReferences(project, '', {
    references: [{ path: 'docs', type: 'directory' }],
  });

  await assert.rejects(
    () => buildCommandFileParts(project, references),
    /Directory references are supported for normal prompts but not command execution/,
  );
});

test('isOpenCodeV2PromptResponseValidationBug detects the current OpenCode v2 prompt body bug', () => {
  assert.equal(
    isOpenCodeV2PromptResponseValidationBug('{"name":"BadRequest","data":{"message":"Expected Session.Message, got {}","kind":"Body"}}'),
    true,
  );
  assert.equal(
    isOpenCodeV2PromptResponseValidationBug('{"name":"BadRequest","data":{"message":"Missing key at [\\"prompt\\"]","kind":"Payload"}}'),
    false,
  );
});

test('shouldFallbackToLegacyPrompt only allows v2 prompt fallback without directory references', async () => {
  const { project, rootPath } = await tempProject();
  await fs.writeFile(path.join(rootPath, 'README.md'), '# readme', 'utf8');
  await fs.mkdir(path.join(rootPath, 'docs'));
  const detail = '{"name":"BadRequest","data":{"message":"Expected Session.Message, got {}","kind":"Body"}}';

  const fileReferences = await normalizeChatReferences(project, '', {
    references: [{ path: 'README.md', type: 'file' }],
  });
  const directoryReferences = await normalizeChatReferences(project, '', {
    references: [{ path: 'docs', type: 'directory' }],
  });

  assert.equal(shouldFallbackToLegacyPrompt(detail, fileReferences), true);
  assert.equal(shouldFallbackToLegacyPrompt(detail, directoryReferences), false);
});

test('buildLegacyPromptParts creates text and file parts for legacy prompt endpoints', async () => {
  const { project, rootPath } = await tempProject();
  await fs.writeFile(path.join(rootPath, 'README.md'), '# readme', 'utf8');
  const references = await normalizeChatReferences(project, '', {
    references: [{ path: 'README.md', type: 'file' }],
  });

  assert.deepEqual(await buildLegacyPromptParts(project, 'hello', references), [
    { type: 'text', text: 'hello' },
    {
      type: 'file',
      mime: 'text/markdown',
      filename: 'README.md',
      url: path.join(rootPath, 'README.md'),
      source: {
        type: 'file',
        path: 'README.md',
        text: { value: '# readme', start: 0, end: 8 },
      },
    },
  ]);
});

test('buildOpenCodePrompt keeps skill names out of prompt text and uses attachments', async () => {
  const { project, rootPath } = await tempProject();
  await fs.writeFile(path.join(rootPath, 'README.md'), 'body', 'utf8');
  await fs.mkdir(path.join(rootPath, 'docs'));

  const prompt = await buildOpenCodePrompt(project, 'Summarize this', {
    skills: ['frontend-design'],
    references: [
      { path: 'README.md', type: 'file' },
      { path: 'docs', type: 'directory' },
    ],
  });

  assert.equal(prompt.text, 'Summarize this');
  assert.equal(prompt.text.includes('## Skill:'), false);
  assert.equal(prompt.files.length, 1);
  assert.equal(prompt.references.length, 1);
});
