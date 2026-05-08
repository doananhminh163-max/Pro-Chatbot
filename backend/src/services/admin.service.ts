import { prisma } from '../config/prisma.js'
import { env } from '../config/env.js'
import {
  deleteAgentStoredConfig,
  getAgentConfigMap,
  getAgentStoredConfig,
  updateAgentStoredConfig,
} from './agent-config-store.service.js'
import { listAgentAuditRecords, recordAgentAudit } from './agent-audit-store.service.js'
import {
  buildGeminiMcpSettings,
  buildOpenCodeMcpSettings,
  listAvailableMcps,
  listAvailableSkills,
  readSelectedSkillInstructions,
  resolveSelectedMcpCatalog,
} from './admin-catalog.service.js'

function formatBytes(value: number) {
  if (value <= 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = value
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

export async function getAdminOverview() {
  const [userCount, sessionCount, documentCount, agentCount, providerCount, failedExecutions] = await Promise.all([
    prisma.user.count(),
    prisma.chatSession.count(),
    prisma.document.count(),
    prisma.agent.count(),
    prisma.provider.count(),
    prisma.message.count({
      where: {
        sender: 'SYSTEM',
        content: {
          startsWith: 'CLI execution failed:',
        },
      },
    }),
  ])

  return {
    userCount,
    sessionCount,
    documentCount,
    agentCount,
    providerCount,
    failedExecutions,
  }
}

export async function listAdminUsers() {
  const [users, documents, sessions] = await Promise.all([
    prisma.user.findMany({
      include: {
        _count: {
          select: {
            documents: true,
            sessions: true,
            memories: true,
          },
        },
      },
      orderBy: [
        { role: 'asc' },
        { email: 'asc' },
      ],
    }),
    prisma.document.findMany({
      select: {
        userId: true,
        size: true,
      },
    }),
    prisma.chatSession.findMany({
      select: {
        userId: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    }),
  ])

  const storageByUser = new Map<string, number>()
  for (const document of documents) {
    storageByUser.set(document.userId, (storageByUser.get(document.userId) || 0) + document.size)
  }

  const lastSeenByUser = new Map<string, Date>()
  for (const session of sessions) {
    if (!lastSeenByUser.has(session.userId)) {
      lastSeenByUser.set(session.userId, session.updatedAt)
    }
  }

  return users.map((user) => {
    const storageBytes = storageByUser.get(user.id) || 0

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      documentCount: user._count.documents,
      sessionCount: user._count.sessions,
      memoryCount: user._count.memories,
      storageBytes,
      storageLabel: formatBytes(storageBytes),
      lastSeenAt: lastSeenByUser.get(user.id)?.toISOString() || null,
    }
  })
}

export async function listAdminProviders() {
  const providers = await prisma.provider.findMany({
    include: {
      models: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  return providers.map((provider) => ({
    id: provider.id,
    name: provider.name,
    config: provider.config,
    modelCount: provider.models.length,
    models: provider.models
      .map((model) => ({
        id: model.id,
        name: model.name,
      }))
      .sort((left, right) => left.name.localeCompare(right.name)),
  }))
}

export async function listAdminAgents() {
  const [agents, storedConfig] = await Promise.all([
    prisma.agent.findMany({
      include: {
        _count: {
          select: {
            sessions: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),
    getAgentConfigMap(),
  ])

  return agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    description: agent.description,
    systemPrompt: agent.systemPrompt,
    selectedSkillIds: storedConfig[agent.id]?.selectedSkillIds || [],
    selectedMcpToolIds: storedConfig[agent.id]?.selectedMcpToolIds || [],
    sessionCount: agent._count.sessions,
    updatedAt: storedConfig[agent.id]?.updatedAt || null,
  }))
}

export async function getAdminAgentWorkspace() {
  const [agents, skills, mcps, audit] = await Promise.all([
    listAdminAgents(),
    listAvailableSkills(),
    listAvailableMcps(),
    listAgentAuditRecords(),
  ])

  return {
    agents,
    skills,
    mcps,
    audit,
  }
}

export async function updateAgentConfiguration(input: {
  agentId: string
  actorUserId: string
  actorEmail: string
  name?: string
  description?: string | null
  systemPrompt?: string | null
  selectedSkillIds?: string[]
  selectedMcpToolIds?: string[]
}) {
  const skills = await listAvailableSkills()
  const mcps = await listAvailableMcps()
  const availableSkillIds = new Set(skills.map((item) => item.id))
  const availableMcpIds = new Set(mcps.map((item) => item.id))

  const selectedSkillIds = (input.selectedSkillIds || []).filter((item) => availableSkillIds.has(item))
  const selectedMcpToolIds = (input.selectedMcpToolIds || []).filter((item) => availableMcpIds.has(item))

  const existing = await prisma.agent.findUnique({
    where: {
      id: input.agentId,
    },
  })

  if (!existing) {
    throw new Error('Agent not found')
  }

  const [updated, stored] = await Promise.all([
    prisma.agent.update({
      where: {
        id: input.agentId,
      },
      data: {
        name: input.name?.trim() || undefined,
        description: input.description === undefined ? undefined : input.description?.trim() || null,
        systemPrompt: input.systemPrompt === undefined ? undefined : input.systemPrompt?.trim() || null,
      },
    }),
    updateAgentStoredConfig({
      agentId: input.agentId,
      selectedSkillIds,
      selectedMcpToolIds,
    }),
  ])

  const changeSummary = [
    input.name !== undefined && input.name.trim() !== existing.name ? 'name' : null,
    input.description !== undefined && (input.description?.trim() || null) !== existing.description ? 'description' : null,
    input.systemPrompt !== undefined && (input.systemPrompt?.trim() || null) !== existing.systemPrompt ? 'system prompt' : null,
    'skills',
    'mcps',
  ].filter(Boolean).join(', ')

  await recordAgentAudit({
    agentId: updated.id,
    agentName: updated.name,
    action: 'UPDATE',
    actorUserId: input.actorUserId,
    actorEmail: input.actorEmail,
    summary: `Updated ${changeSummary || 'configuration'}.`,
  })

  return {
    id: updated.id,
    name: updated.name,
    description: updated.description,
    systemPrompt: updated.systemPrompt,
    selectedSkillIds,
    selectedMcpToolIds,
    updatedAt: stored.updatedAt,
  }
}

export async function createAgentConfiguration(input: {
  actorUserId: string
  actorEmail: string
  name: string
  description?: string | null
  systemPrompt?: string | null
  selectedSkillIds?: string[]
  selectedMcpToolIds?: string[]
}) {
  const skills = await listAvailableSkills()
  const mcps = await listAvailableMcps()
  const availableSkillIds = new Set(skills.map((item) => item.id))
  const availableMcpIds = new Set(mcps.map((item) => item.id))
  const name = input.name.trim()

  if (!name) {
    throw new Error('Agent name is required')
  }

  const selectedSkillIds = (input.selectedSkillIds || []).filter((item) => availableSkillIds.has(item))
  const selectedMcpToolIds = (input.selectedMcpToolIds || []).filter((item) => availableMcpIds.has(item))

  const created = await prisma.agent.create({
    data: {
      name,
      description: input.description?.trim() || null,
      systemPrompt: input.systemPrompt?.trim() || null,
    },
  })

  const config = await updateAgentStoredConfig({
    agentId: created.id,
    selectedSkillIds,
    selectedMcpToolIds,
  })

  await recordAgentAudit({
    agentId: created.id,
    agentName: created.name,
    action: 'CREATE',
    actorUserId: input.actorUserId,
    actorEmail: input.actorEmail,
    summary: `Created agent with ${selectedSkillIds.length} skills and ${selectedMcpToolIds.length} MCPs.`,
  })

  return {
    id: created.id,
    name: created.name,
    description: created.description,
    systemPrompt: created.systemPrompt,
    selectedSkillIds,
    selectedMcpToolIds,
    sessionCount: 0,
    updatedAt: config.updatedAt || null,
  }
}

export async function deleteAgentConfiguration(input: {
  agentId: string
  actorUserId: string
  actorEmail: string
}) {
  const existing = await prisma.agent.findUnique({
    where: {
      id: input.agentId,
    },
    include: {
      _count: {
        select: {
          sessions: true,
        },
      },
    },
  })

  if (!existing) {
    throw new Error('Agent not found')
  }

  await prisma.agent.delete({
    where: {
      id: input.agentId,
    },
  })

  await deleteAgentStoredConfig(input.agentId)

  await recordAgentAudit({
    agentId: existing.id,
    agentName: existing.name,
    action: 'DELETE',
    actorUserId: input.actorUserId,
    actorEmail: input.actorEmail,
    summary: `Deleted agent. ${existing._count.sessions} sessions were detached from this profile.`,
  })

  return {
    id: existing.id,
    name: existing.name,
  }
}

export async function getAdminRuntimeConfig() {
  return {
    commands: {
      gemini: env.geminiCliCommand,
      opencode: env.opencodeCliCommand,
    },
    sandbox: {
      root: env.sandboxRoot,
      ttlMs: env.sandboxJobTtlMs,
      brokerUrl: env.sandboxBrokerUrl,
      requestTimeoutMs: env.sandboxBrokerRequestTimeoutMs,
    },
    storage: {
      userDocsRoot: env.userDocsRoot,
    },
  }
}

export async function getAdminLogs() {
  const logs = await prisma.message.findMany({
    where: {
      sender: 'SYSTEM',
    },
    include: {
      session: {
        include: {
          user: true,
          agent: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 40,
  })

  return logs.map((log) => ({
    id: log.id,
    createdAt: log.createdAt.toISOString(),
    level: log.content.startsWith('CLI execution failed:') ? 'ERROR' : 'INFO',
    message: log.content,
    sessionId: log.sessionId,
    sessionTitle: log.session.title,
    userEmail: log.session.user.email,
    agentName: log.session.agent?.name || null,
  }))
}

export async function resolveAgentRuntime(agentReference?: string | null) {
  if (!agentReference) {
    return null
  }

  const agent = await prisma.agent.findFirst({
    where: {
      OR: [{ id: agentReference }, { name: agentReference }],
    },
  })

  if (!agent) {
    throw new Error('Selected agent was not found')
  }

  const stored = await getAgentStoredConfig(agent.id)
  const selectedSkillIds = stored.selectedSkillIds
  const selectedMcpToolIds = stored.selectedMcpToolIds
  const [skills, mcps, geminiMcpSettings, opencodeMcpSettings] = await Promise.all([
    readSelectedSkillInstructions(selectedSkillIds),
    resolveSelectedMcpCatalog(selectedMcpToolIds),
    buildGeminiMcpSettings(selectedMcpToolIds),
    buildOpenCodeMcpSettings(selectedMcpToolIds),
  ])

  return {
    id: agent.id,
    name: agent.name,
    description: agent.description,
    systemPrompt: agent.systemPrompt,
    skills,
    mcps,
    geminiMcpSettings,
    opencodeMcpSettings,
  }
}
