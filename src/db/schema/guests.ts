import { boolean, pgTable, text, timestamp, uuid, json } from 'drizzle-orm/pg-core'

export interface PersonConfirmation {
  name: string
  isConfirmed: boolean
  type: 'spouse' | 'child' | 'companion'
}

export const tableGuests = pgTable('guest', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  spouse: text('spouse'),
  children: json('children').$type<string[]>().default([]),
  companions: json('companions').$type<string[]>().default([]),
  isConfirmed: boolean('isConfirmed').notNull().default(false),
  spouseConfirmation: boolean('spouse_confirmation').default(false),
  childrenConfirmations: json('children_confirmations').$type<Record<string, boolean>>().default({}),
  companionsConfirmations: json('companions_confirmations').$type<Record<string, boolean>>().default({}),
  token: uuid('token').notNull().unique().defaultRandom(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})
