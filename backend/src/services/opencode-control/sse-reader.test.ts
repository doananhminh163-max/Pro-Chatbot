import assert from 'node:assert/strict';
import test from 'node:test';
import { CHAT_STREAM_TIMEOUT_MS, readServerSentEvents, shouldFinishStreamForIdleEvent } from '../opencode-control.service.js';

test('chat stream timeout is disabled so permission prompts can wait indefinitely', () => {
  assert.equal(CHAT_STREAM_TIMEOUT_MS, null);
});

test('readServerSentEvents can be stopped while a stream read is pending', async () => {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode('data: {"type":"session.next.text.delta","properties":{"delta":"ok"}}\n\n'));
    },
  });
  const iterator = readServerSentEvents(new Response(stream), 10)[Symbol.asyncIterator]();

  const first = await iterator.next();
  assert.deepEqual(first, {
    done: false,
    value: {
      type: 'session.next.text.delta',
      properties: { delta: 'ok' },
    },
  });

  await assert.doesNotReject(() => iterator.return?.());
});

test('shouldFinishStreamForIdleEvent accepts idle events without a session id', () => {
  assert.equal(shouldFinishStreamForIdleEvent({ type: 'session.idle', properties: {} }, 'ses_123'), true);
  assert.equal(shouldFinishStreamForIdleEvent({ type: 'session.idle', properties: { sessionID: 'ses_123' } }, 'ses_123'), true);
  assert.equal(shouldFinishStreamForIdleEvent({ type: 'session.idle', properties: { sessionID: 'ses_other' } }, 'ses_123'), false);
});
