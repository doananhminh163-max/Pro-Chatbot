import type { ChatProvider } from '../services/chat.types.js'

export interface SandboxBrokerExecuteRequest {
  jobId: string
  provider: ChatProvider
  prompt: string
  model?: string
}

export interface SandboxBrokerExecuteResponse {
  reply: string
  usedProvider: ChatProvider
  fallbackUsed: boolean
}
