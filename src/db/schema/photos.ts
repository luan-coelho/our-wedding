import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const tablePhotos = pgTable('photo', {
  id: uuid('id').primaryKey().defaultRandom(),
  url: text('url').notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})
