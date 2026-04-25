import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  // 1. Seed Providers
  const provider = await prisma.provider.upsert({
    where: { name: 'gemini' },
    update: {},
    create: {
      name: 'gemini',
    },
  })
  
  // 2. Seed Models
  const models = [
    'gemini-3.1-pro-preview',
    'gemini-3-flash-preview',
    'gemini-3.1-flash-lite-preview',
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
  ]

  for (const model of models) {
    const existing = await prisma.model.findFirst({
      where: { name: model, providerId: provider.id }
    })
    if (!existing) {
      await prisma.model.create({
        data: {
          name: model,
          providerId: provider.id,
        }
      })
    }
  }

  // 3. Seed Agents
  const agents = [
    { name: 'report-strategist', description: 'Report Strategist' },
    { name: 'debug-operator', description: 'Debug Operator' },
    { name: 'meeting-brief', description: 'Meeting Brief' },
  ]

  for (const agent of agents) {
    await prisma.agent.upsert({
      where: { name: agent.name },
      update: {},
      create: {
        name: agent.name,
        description: agent.description,
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
