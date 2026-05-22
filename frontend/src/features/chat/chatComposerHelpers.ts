import type { ChatContextReference, CommandItem } from '../../types/appData'

export function uniqueReferences(references: ChatContextReference[]) {
  const seen = new Set<string>()
  return references.filter((reference) => {
    const key = `${reference.type}:${reference.path.toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function parseChatOptions(message: string, commands: CommandItem[]) {
  const trimmed = message.trimStart()
  if (trimmed[0] !== '/') return {}

  const match = trimmed.match(/^\/([a-zA-Z0-9_.-]+)(?:\s+([\s\S]*))?$/)
  if (!match) return {}
  const name = match[1]
  const rest = match[2]?.trim() ?? ''

  if (new Set(commands.map((command) => command.name)).has(name)) {
    return { command: name, arguments: rest }
  }
  return {}
}
