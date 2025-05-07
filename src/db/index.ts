import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Cria um pool de conexão PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})

// Cria uma instância do drizzle com o schema e o pool
export const db = drizzle(pool, { schema })

// Exporta o schema para uso em outros lugares da aplicação
export { schema }
