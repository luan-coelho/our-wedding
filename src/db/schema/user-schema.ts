import { UserRole } from '@/lib/auth-types'
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { varchar } from 'drizzle-orm/pg-core/columns/varchar'

export const usersTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: varchar('role').notNull().default(UserRole.GUEST),
  active: boolean('active').notNull().default(true),
})
