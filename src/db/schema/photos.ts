import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const tablePhotos = pgTable('photo', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})
