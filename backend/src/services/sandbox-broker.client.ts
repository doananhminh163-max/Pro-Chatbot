import { env } from '../config/env.js'
import type {
  SandboxBrokerExecuteRequest,
  SandboxBrokerExecuteResponse,
} from '../types/sandbox.js'

export async function executeSandboxJob(payload: SandboxBrokerExecuteRequest) {
  const response = await fetch(`${env.sandboxBrokerUrl}/internal/jobs/execute`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-sandbox-broker-token': env.sandboxBrokerToken,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(env.sandboxBrokerRequestTimeoutMs),
  })

  const rawBody = await response.text()
  let parsedBody: SandboxBrokerExecuteResponse | { message?: string } | null = null

  if (rawBody) {
    try {
      parsedBody = JSON.parse(rawBody) as SandboxBrokerExecuteResponse | { message?: string }
    } catch {
      parsedBody = null
    }
  }

  if (!response.ok) {
    const message = parsedBody && 'message' in parsedBody
      ? parsedBody.message
      : rawBody || `Sandbox broker request failed with status ${response.status}`

    throw new Error(message)
  }

  if (!parsedBody || !('reply' in parsedBody)) {
    throw new Error('Sandbox broker returned an invalid response payload')
  }

  return parsedBody
}
