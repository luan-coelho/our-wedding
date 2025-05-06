import { relations } from 'drizzle-orm'
import { users } from './users'
import { accounts } from './accounts'
import { sessions } from './sessions'
import { gifts } from './gifts'
import { pixKeys } from './pixKeys'

// Relações do usuário
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}))

// Relações de contas
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

// Relações de sessões
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

// Relações de chaves pix
export const pixKeysRelations = relations(pixKeys, ({ many }) => ({
  gifts: many(gifts),
}))

// Relações de presentes
export const giftsRelations = relations(gifts, ({ one }) => ({
  selectedPixKey: one(pixKeys, {
    fields: [gifts.pixKeyId],
    references: [pixKeys.id],
  }),
}))
