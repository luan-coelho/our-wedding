import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { UserRole } from '@/lib/auth-types'

export const tableUsers = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').unique(),
  image: text('image'),
  role: text('role').$type<`${UserRole}`>().notNull().default(UserRole.GUEST),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
})

export type User = typeof tableUsers.$inferSelect
