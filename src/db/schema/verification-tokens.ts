import { pgTable, text, timestamp, primaryKey } from 'drizzle-orm/pg-core'

export const tableVerificationTokens = pgTable(
  'verification-token',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  verificationToken => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
)
