import { relations } from 'drizzle-orm'
import { tableAccounts } from './accounts'
import { tableGifts } from './gifts'
import { tablePixKeys } from './pix-keys'
import { tableSessions } from './sessions'
import { tableUsers } from './users'

// Relações do usuário
export const usersRelations = relations(tableUsers, ({ many }) => ({
  accounts: many(tableAccounts),
  sessions: many(tableSessions),
}))

// Relações de contas
export const accountsRelations = relations(tableAccounts, ({ one }) => ({
  user: one(tableUsers, {
    fields: [tableAccounts.userId],
    references: [tableUsers.id],
  }),
}))

// Relações de sessões
export const sessionsRelations = relations(tableSessions, ({ one }) => ({
  user: one(tableUsers, {
    fields: [tableSessions.userId],
    references: [tableUsers.id],
  }),
}))

// Relações de chaves pix
export const pixKeysRelations = relations(tablePixKeys, ({ many }) => ({
  gifts: many(tableGifts),
}))

// Relações de presentes
export const giftsRelations = relations(tableGifts, ({ one }) => ({
  selectedPixKey: one(tablePixKeys, {
    fields: [tableGifts.pixKeyId],
    references: [tablePixKeys.id],
  }),
}))
