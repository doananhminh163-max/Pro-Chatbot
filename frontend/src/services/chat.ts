import { chatEndpoints, http } from './http'
import type { DocumentItem } from './documents'

export type MessageSender = 'USER' | 'AI' | 'SYSTEM'
export type ChatProvider = 'gemini' | 'opencode'

export interface ChatMessage {
  id: string
  sessionId: string
  sender: MessageSender
  content: string
  documents?: DocumentItem[]
}

export interface ChatSessionSummary {
  id: string
  title: string
  messageCount: number
  lastMessage: {
    sender: MessageSender
    content: string
  } | null
}

export interface ChatSessionDetail {
  id: string
  title: string
  messages: ChatMessage[]
  documents: DocumentItem[]
}

interface SessionListResponse {
  sessions: ChatSessionSummary[]
}

interface SessionDetailResponse {
  session: ChatSessionDetail
}

export interface SendMessageMeta {
  usedProvider: ChatProvider | null
  fallbackUsed: boolean
  requestedProvider: ChatProvider
  requestedModel: string | null
}

export interface SendMessageResponse {
  session: {
    id: string
    title: string
  }
  userMessage: ChatMessage
  assistantMessage: ChatMessage
  meta: SendMessageMeta
}

interface SendMessageInput {
  sessionId?: string
  content: string
  provider: ChatProvider
  model?: string
  agent?: string
  attachments?: string[]
}

export interface ChatConfig {
  providers: {
    id: string
    name: string
    config: string | null
    models: { id: string; name: string }[]
  }[]
  agents: {
    id: string
    name: string
    description: string | null
  }[]
}

export async function fetchChatConfig() {
  const response = await http.get<ChatConfig>(chatEndpoints.config)
  return response.data
}

export async function fetchChatSessions() {
  const response = await http.get<SessionListResponse>(chatEndpoints.sessions)
  return response.data.sessions
}

export async function fetchChatSession(sessionId: string) {
  const response = await http.get<SessionDetailResponse>(chatEndpoints.sessionMessages(sessionId))
  return response.data.session
}

export async function updateSession(sessionId: string, title: string) {
  const response = await http.patch(chatEndpoints.updateSession(sessionId), { title })
  return response.data
}

export async function deleteSession(sessionId: string) {
  const response = await http.delete(chatEndpoints.deleteSession(sessionId))
  return response.data
}

export async function deleteAllSessions() {
  const response = await http.delete(chatEndpoints.sessions)
  return response.data
}

export async function sendChatMessage(payload: SendMessageInput) {
  const response = await http.post<SendMessageResponse>(chatEndpoints.sendMessage, payload)
  return response.data
}
