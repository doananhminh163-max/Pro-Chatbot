import type { Request, Response } from 'express'
import { z } from 'zod'
import {
  createAgentConfiguration,
  deleteAgentConfiguration,
  getAdminAgentWorkspace,
  getAdminLogs,
  getAdminOverview,
  getAdminRuntimeConfig,
  listAdminProviders,
  listAdminUsers,
  updateAgentConfiguration,
} from '../services/admin.service.js'

const updateAgentSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  systemPrompt: z.string().nullable().optional(),
  selectedSkillIds: z.array(z.string()).optional(),
  selectedMcpToolIds: z.array(z.string()).optional(),
})

const createAgentSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  systemPrompt: z.string().nullable().optional(),
  selectedSkillIds: z.array(z.string()).optional(),
  selectedMcpToolIds: z.array(z.string()).optional(),
})

function getAgentIdParam(request: Request) {
  return Array.isArray(request.params.agentId) ? request.params.agentId[0] || '' : request.params.agentId || ''
}

export async function getAdminOverviewHandler(_request: Request, response: Response) {
  const overview = await getAdminOverview()
  response.status(200).json({ overview })
}

export async function getAdminUsersHandler(_request: Request, response: Response) {
  const users = await listAdminUsers()
  response.status(200).json({ users })
}

export async function getAdminProvidersHandler(_request: Request, response: Response) {
  const providers = await listAdminProviders()
  response.status(200).json({ providers })
}

export async function getAdminAgentsHandler(_request: Request, response: Response) {
  const workspace = await getAdminAgentWorkspace()
  response.status(200).json(workspace)
}

export async function createAdminAgentHandler(request: Request, response: Response) {
  try {
    const payload = createAgentSchema.parse(request.body)
    const actor = request.auth

    if (!actor) {
      response.status(401).json({ message: 'Unauthorized' })
      return
    }

    const agent = await createAgentConfiguration({
      actorUserId: actor.sub,
      actorEmail: actor.email,
      name: payload.name,
      description: payload.description,
      systemPrompt: payload.systemPrompt,
      selectedSkillIds: payload.selectedSkillIds,
      selectedMcpToolIds: payload.selectedMcpToolIds,
    })

    response.status(201).json({ agent })
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status(400).json({ message: 'Invalid agent create payload', errors: error.flatten() })
      return
    }

    response.status(400).json({ message: (error as Error).message || 'Unable to create agent' })
  }
}

export async function updateAdminAgentHandler(request: Request, response: Response) {
  try {
    const payload = updateAgentSchema.parse(request.body)
    const actor = request.auth

    if (!actor) {
      response.status(401).json({ message: 'Unauthorized' })
      return
    }

    const agent = await updateAgentConfiguration({
      agentId: getAgentIdParam(request),
      actorUserId: actor.sub,
      actorEmail: actor.email,
      name: payload.name,
      description: payload.description,
      systemPrompt: payload.systemPrompt,
      selectedSkillIds: payload.selectedSkillIds,
      selectedMcpToolIds: payload.selectedMcpToolIds,
    })

    response.status(200).json({ agent })
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status(400).json({ message: 'Invalid agent update payload', errors: error.flatten() })
      return
    }

    response.status(400).json({ message: (error as Error).message || 'Unable to update agent' })
  }
}

export async function deleteAdminAgentHandler(request: Request, response: Response) {
  try {
    const actor = request.auth

    if (!actor) {
      response.status(401).json({ message: 'Unauthorized' })
      return
    }

    const agent = await deleteAgentConfiguration({
      agentId: getAgentIdParam(request),
      actorUserId: actor.sub,
      actorEmail: actor.email,
    })

    response.status(200).json({ agent })
  } catch (error) {
    response.status(400).json({ message: (error as Error).message || 'Unable to delete agent' })
  }
}

export async function getAdminConfigHandler(_request: Request, response: Response) {
  const config = await getAdminRuntimeConfig()
  response.status(200).json({ config })
}

export async function getAdminLogsHandler(_request: Request, response: Response) {
  const logs = await getAdminLogs()
  response.status(200).json({ logs })
}
