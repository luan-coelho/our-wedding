import { boolean, pgTable, text, timestamp, uuid, json } from 'drizzle-orm/pg-core'

export const tableGuests = pgTable('guest', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  spouse: text('spouse'),
  children: json('children').$type<string[]>().default([]),
  companions: json('companions').$type<string[]>().default([]),
  isConfirmed: boolean('isConfirmed').notNull().default(false),
  token: uuid('token').notNull().unique().defaultRandom(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})
