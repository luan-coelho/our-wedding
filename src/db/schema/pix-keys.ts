import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { tableGifts } from '@/db/schema/gifts'

export const tablePixKeys = pgTable('pix-key', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  key: text('key').notNull().unique(),
  type: text('type').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})

export const pixKeysRelations = relations(tablePixKeys, ({ many }) => ({
  gifts: many(tableGifts),
}))
