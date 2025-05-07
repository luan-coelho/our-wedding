import { randomUUID } from 'crypto'
import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const tableUsers = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified'),
  image: text('image'),
  role: text('role').notNull().default('guest'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})
