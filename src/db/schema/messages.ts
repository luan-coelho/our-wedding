import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const tableMessages = pgTable('message', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})
