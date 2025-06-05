// ============================================================================
// SERVICES INDEX - Centralized exports for all domain services
// ============================================================================

// Individual service exports
export * from './gifts.service'
export * from './guests.service'
export * from './messages.service'
export * from './pixkeys.service'
export * from './users.service'

// Organized service objects for easy importing
import { giftsService } from './gifts.service'
import { guestsService } from './guests.service'
import { messagesService } from './messages.service'
import { pixKeysService } from './pixkeys.service'
import { usersService } from './users.service'

export { giftsService } from './gifts.service'
export { guestsService } from './guests.service'
export { messagesService } from './messages.service'
export { pixKeysService } from './pixkeys.service'
export { usersService } from './users.service'

// ============================================================================
// CONVENIENCE EXPORTS - Common patterns for easy access
// ============================================================================

// All services in one object for bulk operations
export const services = {
  gifts: giftsService,
  guests: guestsService,
  messages: messagesService,
  pixKeys: pixKeysService,
  users: usersService,
} as const

// Type for service names
export type ServiceName = keyof typeof services
