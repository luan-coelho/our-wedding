import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const tableMessages = pgTable('message', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
})
