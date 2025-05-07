import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { tableUsers } from './users'

export const tableSessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => tableUsers.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})
