import assert from 'node:assert/strict'
import test from 'node:test'
import { parseChatOptions, uniqueReferences } from './chatComposerHelpers.ts'
import type { ChatContextReference, CommandItem } from '../../types/appData.ts'

function command(name: string, source = 'command'): CommandItem {
  return {
    name,
    source,
    description: `${name} command`,
    sourcePath: `${source}:/${name}`,
    preview: '',
    builtIn: true,
  }
}

test('parseChatOptions treats native skill command records as slash commands', () => {
  assert.deepEqual(
    parseChatOptions('/frontend-design polish composer', [command('frontend-design', 'skill')]),
    { command: 'frontend-design', arguments: 'polish composer' },
  )
})

test('parseChatOptions ignores legacy dollar skill syntax', () => {
  assert.deepEqual(
    parseChatOptions('$frontend-design polish composer', [command('frontend-design', 'skill')]),
    {},
  )
})

test('uniqueReferences deduplicates files and directories independently', () => {
  const references: ChatContextReference[] = [
    { path: 'docs', type: 'directory' },
    { path: 'docs', type: 'file' },
    { path: 'DOCS', type: 'directory' },
  ]

  assert.deepEqual(uniqueReferences(references), [
    { path: 'docs', type: 'directory' },
    { path: 'docs', type: 'file' },
  ])
})
