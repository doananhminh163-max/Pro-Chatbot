import { prisma } from '../config/prisma.js'

export async function getChatConfig() {
  const [providers, agents] = await Promise.all([
    prisma.provider.findMany({
      include: {
        models: true,
      },
    }),
    prisma.agent.findMany(),
  ])

  return {
    providers: providers.map(p => ({
      id: p.id,
      name: p.name,
      config: p.config,
      models: p.models.map(m => ({
        id: m.id,
        name: m.name,
      })),
    })),
    agents: agents.map(a => ({
      id: a.id,
      name: a.name,
      description: a.description,
    })),
  }
}
