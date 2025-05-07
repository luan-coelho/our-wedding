import { pgTable, serial, text, timestamp, real, integer } from 'drizzle-orm/pg-core'
import { tablePixKeys } from './pix-keys'

export const tableGifts = pgTable('gift', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: real('price'),
  pixKey: text('pixKey'),
  pixKeyId: integer('pixKeyId').references(() => tablePixKeys.id),
  imageUrl: text('imageUrl'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})
