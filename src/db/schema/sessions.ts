import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { randomUUID } from 'crypto'
import { users } from './users'

export const sessions = pgTable('Session', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  sessionToken: text('sessionToken').notNull().unique(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
})
