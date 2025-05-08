import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, real, uuid } from 'drizzle-orm/pg-core'
import { tablePixKeys } from './pix-keys'

export const tableGifts = pgTable('gift', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: real('price'),
  pixKey: text('pixKey'),
  pixKeyId: uuid('pixKeyId').references(() => tablePixKeys.id),
  imageUrl: text('imageUrl'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})

export const giftsRelations = relations(tableGifts, ({ one }) => ({
  selectedPixKey: one(tablePixKeys, {
    fields: [tableGifts.pixKeyId],
    references: [tablePixKeys.id],
  }),
}))
