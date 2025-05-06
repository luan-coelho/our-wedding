import { randomUUID } from 'crypto'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('User', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified'),
  password: text('password'),
  image: text('image'),
  role: text('role').notNull().default('user'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
})
