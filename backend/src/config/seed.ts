import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  // 1. Seed Providers and models
  const providerSeeds = [
    {
      name: 'gemini',
      models: [
        'gemini-3.1-pro-preview',
        'gemini-3-flash-preview',
        'gemini-3.1-flash-lite-preview',
        'gemini-2.5-pro',
        'gemini-2.5-flash',
        'gemini-2.5-flash-lite',
      ],
    },
    {
      name: 'opencode',
      models: [
        'opencode/minimax-m2.5-free',
        'opencode/ling-2.6-flash',
        'opencode/hy3-preview-free',
        'opencode/nemotron-3-super-free',
        'opencode/big-pickle',
      ],
    },
  ]

  for (const providerSeed of providerSeeds) {
    const provider = await prisma.provider.upsert({
      where: { name: providerSeed.name },
      update: {},
      create: {
        name: providerSeed.name,
      },
    })

    for (const model of providerSeed.models) {
      const existing = await prisma.model.findFirst({
        where: { name: model, providerId: provider.id },
      })

      if (!existing) {
        await prisma.model.create({
          data: {
            name: model,
            providerId: provider.id,
          },
        })
      }
    }
  }

  // 2. Seed Agents
  const agents = [
    {
      name: 'report-strategist',
      description: 'Synthesizes uploaded materials into concise, decision-ready reports.',
      systemPrompt: 'Prioritize structure, evidence, and actionable recommendations. Surface uncertainties explicitly.',
    },
    {
      name: 'debug-operator',
      description: 'Investigates failures, isolates root causes, and proposes concrete fixes.',
      systemPrompt: 'Think like a production engineer. Focus on reproducibility, failure boundaries, and lowest-risk fixes.',
    },
    {
      name: 'meeting-brief',
      description: 'Turns notes and attachments into sharp briefings, summaries, and follow-up actions.',
      systemPrompt: 'Produce crisp summaries, decisions, open questions, and next steps with minimal fluff.',
    },
  ]

  for (const agent of agents) {
    await prisma.agent.upsert({
      where: { name: agent.name },
      update: {
        description: agent.description,
        systemPrompt: agent.systemPrompt,
      },
      create: {
        name: agent.name,
        description: agent.description,
        systemPrompt: agent.systemPrompt,
      }
    })
  }

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
