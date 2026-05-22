import type { ChatResponse, ChatSubmitOptions, MarketplaceItem } from './appData'

export type ActionHandlers = {
  submitChatMessage: (sessionId: string | null, message: string, options?: ChatSubmitOptions) => Promise<ChatResponse>
  createConfigProposal: () => Promise<void>
  createAgentProposal: () => Promise<void>
  updatePermissionProposal: () => Promise<void>
  importSkillProposal: () => Promise<void>
  installMarketplaceProposal: (item: MarketplaceItem) => Promise<void>
  createMcpProposal: () => Promise<void>
  createCommandProposal: () => Promise<void>
}
