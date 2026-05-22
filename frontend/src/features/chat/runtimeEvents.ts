import type { ChatPermissionPrompt, ChatToolActivity } from '../../types/appData'

export type ChatRuntimePart = ChatToolActivity | ChatPermissionPrompt

export function isPermissionRuntimePart(part: ChatRuntimePart): part is ChatPermissionPrompt {
  return 'permission' in part
}

export function firstPendingPermissionPromptId(partsByMessage: ChatRuntimePart[][]) {
  for (const parts of partsByMessage) {
    const prompt = parts.find((part) => isPermissionRuntimePart(part) && part.status === 'pending')
    if (prompt) return prompt.id
  }

  return null
}

export function visibleRuntimeParts(parts: ChatRuntimePart[], activePermissionPromptId: string | null) {
  return parts.filter((part) => (
    !isPermissionRuntimePart(part)
    || (part.status === 'pending' && part.id === activePermissionPromptId)
  ))
}
