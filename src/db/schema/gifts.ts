import { pgTable, serial, text, timestamp, real, integer } from 'drizzle-orm/pg-core'
import { pixKeys } from './pixKeys'

export const gifts = pgTable('Gift', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: real('price'),
  pixKey: text('pixKey'),
  pixKeyId: integer('pixKeyId').references(() => pixKeys.id),
  imageUrl: text('imageUrl'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})
