import assert from 'node:assert/strict'
import test from 'node:test'
import { readApiResponse } from './apiResponse.ts'

test('readApiResponse reports the HTTP status when an error response has no JSON body', async () => {
  const response = new Response('', { status: 502, statusText: 'Bad Gateway' })

  await assert.rejects(
    () => readApiResponse<string>(response),
    /API request failed: 502/,
  )
})

test('readApiResponse unwraps a successful API envelope', async () => {
  const response = Response.json({ success: true, data: { name: 'workspace' } })

  assert.deepEqual(await readApiResponse<{ name: string }>(response), { name: 'workspace' })
})
