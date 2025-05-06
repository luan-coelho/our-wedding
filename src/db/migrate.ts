import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

async function runMigrations() {
  console.log('Iniciando migrações do Drizzle...')

  // Cria um pool de conexão PostgreSQL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
  })

  // Inicializa o Drizzle com o pool
  const db = drizzle(pool)

  // Executa as migrações
  console.log('Aplicando migrações...')
  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('Migrações aplicadas com sucesso!')

  // Fecha a conexão
  await pool.end()
  console.log('Conexão fechada.')
}

runMigrations()
  .then(() => {
    console.log('Processo de migração concluído.')
    process.exit(0)
  })
  .catch(error => {
    console.error('Erro durante o processo de migração:', error)
    process.exit(1)
  })
