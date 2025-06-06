import { relations } from 'drizzle-orm'
import { pgTable, real, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { pixKeysTable } from '@/db/schema/pix-key-schema'

export const giftsTable = pgTable('gift', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: real('price'),
  pixKey: text('pixKey'),
  pixKeyId: uuid('pixKeyId').references(() => pixKeysTable.id),
  imageUrl: text('imageUrl'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})

export const giftsRelations = relations(giftsTable, ({ one }) => ({
  selectedPixKey: one(pixKeysTable, {
    fields: [giftsTable.pixKeyId],
    references: [pixKeysTable.id],
  }),
}))
