import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildConfigSettingCards,
  buildDraftValues,
  buildFormFields,
  buildPatchFromForm,
  mergeConfigPatch,
} from './configSettingsSchema.ts'

test('config settings schema builds editable server fields and patch values', () => {
  const [serverCard] = buildConfigSettingCards({
    server: {
      hostname: '127.0.0.1',
      port: 4097,
      cors: ['http://localhost:5173'],
    },
  })

  assert.equal(serverCard.title, 'Server')
  assert.deepEqual(buildFormFields(serverCard).map((field) => field.name), ['hostname', 'port', 'cors'])

  const draftValues = buildDraftValues([serverCard], [])
  const patch = buildPatchFromForm(serverCard, {
    ...draftValues.Server,
    hostname: '0.0.0.0',
    port: '4098',
    cors: 'http://localhost:5173\nhttp://127.0.0.1:5173',
  })

  assert.deepEqual(patch, {
    server: {
      hostname: '0.0.0.0',
      port: 4098,
      cors: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    },
  })
  assert.deepEqual(mergeConfigPatch({ server: { hostname: '127.0.0.1', port: 4097 } }, patch), {
    server: {
      hostname: '0.0.0.0',
      port: 4098,
      cors: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    },
  })
})
