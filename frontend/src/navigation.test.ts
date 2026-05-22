import assert from 'node:assert/strict'
import test from 'node:test'

import { isKnownPagePath, navIdFromPathname, pagePath, sections } from './navigation.ts'

test('chatbot and session management routes are not addressable pages', () => {
  assert.equal(navIdFromPathname('/'), 'agents')
  assert.equal(navIdFromPathname('/chat'), 'agents')
  assert.equal(navIdFromPathname('/chat/new'), 'agents')
  assert.equal(navIdFromPathname('/sessions'), 'agents')

  assert.equal(isKnownPagePath('/agents'), true)
  assert.equal(isKnownPagePath('/chat'), false)
  assert.equal(isKnownPagePath('/sessions'), false)
})

test('primary navigation keeps the remaining control-plane pages', () => {
  assert.deepEqual(
    sections.flatMap((section) => section.items.map((item) => item.id)),
    ['agents', 'skills', 'mcp', 'commands'],
  )
  assert.equal(pagePath('agents'), '/agents')
})
