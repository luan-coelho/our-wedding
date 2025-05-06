import { pgTable, serial, text, boolean, timestamp, uuid } from 'drizzle-orm/pg-core'

export const guests = pgTable('Guest', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  isConfirmed: boolean('isConfirmed').notNull().default(false),
  token: uuid('token').notNull().unique().defaultRandom(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})
