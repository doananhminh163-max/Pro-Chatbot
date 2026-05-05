import { MemoryKind, MemoryScope, type SenderType } from '@prisma/client'
import { prisma } from '../config/prisma.js'
import { executeSandboxJob } from './sandbox-broker.client.js'
import { prepareSandboxJob } from './sandbox-workspace.service.js'
import type { ChatProvider } from './chat.types.js'

const GLOBAL_MEMORY_LIMIT = 12
const MEMORY_TRANSCRIPT_LIMIT = 50

interface ContextMessage {
  sender: SenderType
  content: string
}

interface MemoryItemPayload {
  kind?: MemoryKind | string
  title?: string
  content?: string
  importance?: number
}

interface MemoryExtractionPayload {
  globalMemories?: MemoryItemPayload[]
}

interface UpsertMemoryItem {
  kind: MemoryKind
  title: string
  content: string
  importance: number
}

export interface MemoryEntryView {
  id: string
  scope: MemoryScope
  kind: MemoryKind
  title: string
  content: string
  importance: number
  sessionId: string | null
  sessionTitle: string | null
  lastUsedAt: string
}

export interface MemoryOverview {
  globalMemories: MemoryEntryView[]
}

export interface MemoryPromptContext {
  globalMemories: Array<{
    title: string
    content: string
    kind: MemoryKind
    importance: number
  }>
}

interface RefreshMemoriesInput {
  userId: string
  sessionId: string
  provider: ChatProvider
  model?: string
  memoryEnabled: boolean
  transcript: ContextMessage[]
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function truncate(value: string, maxLength: number) {
  const normalized = normalizeWhitespace(value)

  if (normalized.length <= maxLength) {
    return normalized
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`
}

function normalizeImportance(value?: number) {
  if (!Number.isFinite(value)) {
    return 50
  }

  return Math.min(100, Math.max(1, Math.round(value as number)))
}

function normalizeKind(kind?: MemoryKind | string) {
  if (!kind) {
    return MemoryKind.FACT
  }

  const upperKind = kind.toString().trim().toUpperCase()

  if (upperKind in MemoryKind) {
    return MemoryKind[upperKind as keyof typeof MemoryKind]
  }

  return MemoryKind.FACT
}

function sanitizeMemoryItem(item: MemoryItemPayload): UpsertMemoryItem | null {
  const title = truncate(item.title || '', 80)
  const content = truncate(item.content || '', 280)

  if (!title || !content) {
    return null
  }

  return {
    kind: normalizeKind(item.kind),
    title,
    content,
    importance: normalizeImportance(item.importance),
  }
}

function stripJsonCodeFence(raw: string) {
  const trimmed = raw.trim()
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i)
  return fencedMatch ? fencedMatch[1].trim() : trimmed
}

function extractBalancedJsonBlock(raw: string) {
  const startIndex = raw.search(/[\[{]/)

  if (startIndex === -1) {
    return null
  }

  const openingChar = raw[startIndex]
  const closingChar = openingChar === '{' ? '}' : ']'
  let depth = 0
  let inString = false
  let isEscaped = false

  for (let index = startIndex; index < raw.length; index += 1) {
    const currentChar = raw[index]

    if (inString) {
      if (isEscaped) {
        isEscaped = false
        continue
      }

      if (currentChar === '\\') {
        isEscaped = true
        continue
      }

      if (currentChar === '"') {
        inString = false
      }

      continue
    }

    if (currentChar === '"') {
      inString = true
      continue
    }

    if (currentChar === openingChar) {
      depth += 1
      continue
    }

    if (currentChar === closingChar) {
      depth -= 1

      if (depth === 0) {
        return raw.slice(startIndex, index + 1)
      }
    }
  }

  return null
}

function isNoMemoryResponse(raw: string) {
  const normalized = normalizeWhitespace(raw).toLowerCase()

  return [
    'no durable memory',
    'no durable memories',
    'no global memory',
    'no global memories',
    'no new memory',
    'no new memories',
    'nothing to store',
    'none',
  ].some((phrase) => normalized === phrase || normalized.includes(phrase))
}

function parseMemoryExtraction(raw: string): MemoryExtractionPayload | null {
  const normalized = stripJsonCodeFence(raw)

  if (!normalized) {
    return { globalMemories: [] }
  }

  if (isNoMemoryResponse(normalized)) {
    return { globalMemories: [] }
  }

  try {
    const parsed = JSON.parse(normalized) as MemoryExtractionPayload | MemoryItemPayload[]

    if (Array.isArray(parsed)) {
      return { globalMemories: parsed }
    }

    if (parsed && typeof parsed === 'object') {
      return parsed as MemoryExtractionPayload
    }
  } catch {
    const jsonBlock = extractBalancedJsonBlock(normalized)

    if (!jsonBlock) {
      return null
    }

    try {
      const parsed = JSON.parse(jsonBlock) as MemoryExtractionPayload | MemoryItemPayload[]

      if (Array.isArray(parsed)) {
        return { globalMemories: parsed }
      }

      if (parsed && typeof parsed === 'object') {
        return parsed as MemoryExtractionPayload
      }
    } catch {
      return null
    }
  }

  return null
}

function formatPromptMemoryEntries(
  entries: Array<{ title: string; content: string; kind: MemoryKind; importance: number }>,
) {
  if (entries.length === 0) {
    return '(none)'
  }

  return entries
    .map(
      (entry, index) =>
        `${index + 1}. [${entry.kind}] ${entry.title}: ${entry.content} (importance ${entry.importance})`,
    )
    .join('\n')
}

async function runMemoryExtractionPrompt(input: {
  userId: string
  sessionId: string
  provider: ChatProvider
  model?: string
  prompt: string
}) {
  await prepareSandboxJob({
    userId: input.userId,
    sessionId: input.sessionId,
    provider: input.provider,
    prompt: input.prompt,
    model: input.model,
    attachments: [],
  })

  const result = await executeSandboxJob({
    userId: input.userId,
    sessionId: input.sessionId,
    provider: input.provider,
    prompt: input.prompt,
    model: input.model,
  })

  return result.reply
}

async function upsertGlobalMemories(userId: string, items: MemoryItemPayload[] | undefined) {
  const sanitizedItems = (items ?? [])
    .map(sanitizeMemoryItem)
    .filter((item): item is UpsertMemoryItem => item !== null)

  for (const item of sanitizedItems) {
    const existing = await prisma.memoryEntry.findFirst({
      where: {
        userId,
        scope: MemoryScope.GLOBAL,
        sessionId: null,
        title: item.title,
      },
    })

    if (existing) {
      await prisma.memoryEntry.update({
        where: { id: existing.id },
        data: {
          kind: item.kind,
          content: item.content,
          importance: item.importance,
          lastUsedAt: new Date(),
        },
      })
      continue
    }

    await prisma.memoryEntry.create({
      data: {
        userId,
        scope: MemoryScope.GLOBAL,
        sessionId: null,
        kind: item.kind,
        title: item.title,
        content: item.content,
        importance: item.importance,
      },
    })
  }

  const keepers = await prisma.memoryEntry.findMany({
    where: {
      userId,
      scope: MemoryScope.GLOBAL,
    },
    orderBy: [{ importance: 'desc' }, { lastUsedAt: 'desc' }, { updatedAt: 'desc' }],
    select: { id: true },
    take: GLOBAL_MEMORY_LIMIT,
  })

  await prisma.memoryEntry.deleteMany({
    where: {
      userId,
      scope: MemoryScope.GLOBAL,
      id: {
        notIn: keepers.map((item) => item.id),
      },
    },
  })
}

function buildMemoryExtractionPrompt(input: {
  globalMemories: MemoryPromptContext['globalMemories']
  transcript: ContextMessage[]
}) {
  const transcriptBlock = input.transcript
    .slice(-MEMORY_TRANSCRIPT_LIMIT)
    .map((message) => `${message.sender}: ${truncate(message.content, 600)}`)
    .join('\n\n')

  return [
    'You are a global memory extraction engine for a multi-turn chatbot.',
    'Return strict JSON only. Do not wrap the JSON in markdown.',
    'Capture only durable information that should persist across future sessions.',
    'Do not create session-specific TODOs, temporary summaries, or one-off requests.',
    'Do not store ephemeral greetings, one-off chit-chat, or facts already obvious from system instructions.',
    'Keep titles short. Keep content concrete. Avoid duplicates.',
    '',
    'JSON schema:',
    '{"globalMemories":[{"kind":"TASK|FACT|PREFERENCE|DOMAIN|PROFILE","title":"string","content":"string","importance":1}]}',
    '',
    'Existing global memories:',
    formatPromptMemoryEntries(input.globalMemories),
    '',
    'Recent user transcript:',
    transcriptBlock || '(empty)',
    '',
    'Rules:',
    '- Always return exactly one JSON object.',
    '- If there is no durable memory to save, return {"globalMemories":[]}.',
    '- globalMemories: max 4 items and only if durable across future sessions.',
    '- importance: integer 1-100.',
  ].join('\n')
}

export async function buildMemoryPromptContext(
  userId: string,
  memoryEnabled = true,
): Promise<MemoryPromptContext> {
  if (!memoryEnabled) {
    return {
      globalMemories: [],
    }
  }

  const globalMemories = await prisma.memoryEntry.findMany({
    where: {
      userId,
      scope: MemoryScope.GLOBAL,
    },
    orderBy: [{ importance: 'desc' }, { lastUsedAt: 'desc' }, { updatedAt: 'desc' }],
    take: GLOBAL_MEMORY_LIMIT,
    select: {
      title: true,
      content: true,
      kind: true,
      importance: true,
    },
  })

  return {
    globalMemories,
  }
}

export async function refreshMemoriesForTurn(input: RefreshMemoriesInput) {
  if (!input.memoryEnabled) {
    return
  }

  const memoryContext = await buildMemoryPromptContext(input.userId, true)

  try {
    const raw = await runMemoryExtractionPrompt({
      userId: input.userId,
      sessionId: input.sessionId,
      provider: input.provider,
      model: input.model,
      prompt: buildMemoryExtractionPrompt({
        globalMemories: memoryContext.globalMemories,
        transcript: input.transcript,
      }),
    })

    const extracted = parseMemoryExtraction(raw)

    if (!extracted) {
      throw new Error(`Unable to parse memory extraction payload: ${truncate(raw, 220)}`)
    }

    await upsertGlobalMemories(input.userId, extracted.globalMemories)
  } catch (error) {
    console.error('[memory.service] memory extraction failed', error)
  }
}

function toMemoryEntryView(entry: {
  id: string
  scope: MemoryScope
  kind: MemoryKind
  title: string
  content: string
  importance: number
  sessionId: string | null
  lastUsedAt: Date
  session?: {
    title: string
  } | null
}): MemoryEntryView {
  return {
    id: entry.id,
    scope: entry.scope,
    kind: entry.kind,
    title: entry.title,
    content: entry.content,
    importance: entry.importance,
    sessionId: entry.sessionId,
    sessionTitle: entry.session?.title ?? null,
    lastUsedAt: entry.lastUsedAt.toISOString(),
  }
}

export async function getMemoryOverview(userId: string): Promise<MemoryOverview> {
  const globalMemories = await prisma.memoryEntry.findMany({
    where: {
      userId,
      scope: MemoryScope.GLOBAL,
    },
    include: {
      session: {
        select: {
          title: true,
        },
      },
    },
    orderBy: [{ importance: 'desc' }, { lastUsedAt: 'desc' }],
    take: GLOBAL_MEMORY_LIMIT,
  })

  return {
    globalMemories: globalMemories.map(toMemoryEntryView),
  }
}

export async function clearGlobalMemories(userId: string) {
  await prisma.memoryEntry.deleteMany({
    where: {
      userId,
      scope: MemoryScope.GLOBAL,
    },
  })
}
