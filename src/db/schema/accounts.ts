import { randomUUID } from 'crypto'
import { pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { users } from './users'

export const accounts = pgTable(
  'Account',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: text('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  table => {
    return {
      providerProviderAccountIdIdx: uniqueIndex('provider_providerAccountId_idx').on(
        table.provider,
        table.providerAccountId,
      ),
    }
  },
)
