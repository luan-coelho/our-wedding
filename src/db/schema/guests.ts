import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const tableGuests = pgTable('guest', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  isConfirmed: boolean('isConfirmed').notNull().default(false),
  token: uuid('token').notNull().unique().defaultRandom(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})
