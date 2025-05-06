import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const messages = pgTable('Message', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})
