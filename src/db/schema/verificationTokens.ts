import { pgTable, text, timestamp, primaryKey } from 'drizzle-orm/pg-core'

export const verificationTokens = pgTable(
  'VerificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull().unique(),
    expires: timestamp('expires').notNull(),
  },
  table => {
    return {
      pk: primaryKey({ columns: [table.identifier, table.token] }),
    }
  },
)
