import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const pixKeys = pgTable('PixKey', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  key: text('key').notNull().unique(),
  type: text('type').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})
