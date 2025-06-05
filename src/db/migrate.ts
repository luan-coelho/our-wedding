import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!

// Disable prepare as it's not supported for migration
const sql = postgres(connectionString, { max: 1 })
const db = drizzle(sql)

const main = async () => {
  console.log('Running migrations...')
  
  try {
    await migrate(db, { migrationsFolder: 'drizzle' })
    console.log('Migrations completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
  
  await sql.end()
}

main()
