import type { MarketplaceItem } from './appData'

export type ActionHandlers = {
  createConfigProposal: () => Promise<void>
  createAgentProposal: () => Promise<void>
  updatePermissionProposal: () => Promise<void>
  importSkillProposal: () => Promise<void>
  installMarketplaceProposal: (item: MarketplaceItem) => Promise<void>
  createMcpProposal: () => Promise<void>
  createCommandProposal: () => Promise<void>
}
