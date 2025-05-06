import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Obter o diretório atual do script
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Diretório raiz da aplicação
const rootDir = path.resolve(__dirname, '..');

async function runCommand(command) {
  try {
    const { stdout, stderr } = await execPromise(command);
    console.log('Command output:', stdout);
    if (stderr) {
      console.error('Command stderr:', stderr);
    }
    return true;
  } catch (error) {
    console.error('Command execution error:', error);
    return false;
  }
}

async function runMigrations() {
  console.log('Iniciando migrações do Drizzle...');

  try {
    // Verificar se a pasta de migrações existe
    const migrationsFolder = path.join(rootDir, 'drizzle');
    console.log(`Verificando pasta de migrações em: ${migrationsFolder}`);
    
    if (!fs.existsSync(migrationsFolder)) {
      console.error(`Pasta de migrações não encontrada em: ${migrationsFolder}`);
      console.log('Criando pasta de migrações...');
      fs.mkdirSync(migrationsFolder, { recursive: true });
    }
    
    // Verificar se o arquivo journal existe
    const journalFile = path.join(migrationsFolder, 'meta', '_journal.json');
    const metaFolder = path.join(migrationsFolder, 'meta');
    
    if (!fs.existsSync(metaFolder)) {
      console.log(`Criando pasta meta em: ${metaFolder}`);
      fs.mkdirSync(metaFolder, { recursive: true });
    }
    
    if (!fs.existsSync(journalFile)) {
      console.log(`Arquivo journal não encontrado em: ${journalFile}`);
      // Criar um arquivo journal vazio
      console.log(`Criando arquivo journal vazio em: ${journalFile}`);
      fs.writeFileSync(journalFile, JSON.stringify({
        "version": "5",
        "dialect": "pg",
        "entries": []
      }));
    }

    // Cria um pool de conexão PostgreSQL
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Tenta conectar ao banco de dados
    console.log('Testando conexão com o banco de dados...');
    await pool.query('SELECT 1');
    console.log('Conexão com o banco de dados estabelecida com sucesso!');

    // Tentar primeiro usar migrate
    try {
      console.log(`Aplicando migrações usando migrate do drizzle-orm...`);
      const db = drizzle(pool);
      await migrate(db, { migrationsFolder });
      console.log('Migrações aplicadas com sucesso!');
    } catch (migrateError) {
      console.error('Erro ao usar migrate:', migrateError);
      
      // Tentar usar drizzle-kit push como alternativa
      console.log('Tentando usar drizzle-kit push como alternativa...');
      
      // Verificar se o drizzle.config.ts existe
      const drizzleConfigPath = path.join(rootDir, 'drizzle.config.ts');
      if (fs.existsSync(drizzleConfigPath)) {
        console.log(`Usando configuração em: ${drizzleConfigPath}`);
        
        // Executar o comando drizzle-kit push
        const successPush = await runCommand(
          `cd ${rootDir} && npx drizzle-kit push:pg --schema=./src/db/schema/*.ts --config=drizzle.config.ts`
        );
        
        if (successPush) {
          console.log('Migração com drizzle-kit push:pg concluída com sucesso!');
        } else {
          throw new Error('Falha ao executar drizzle-kit push:pg');
        }
      } else {
        console.error('Arquivo drizzle.config.ts não encontrado');
        throw migrateError;
      }
    }

    // Fecha a conexão
    await pool.end();
    console.log('Conexão fechada.');
    
    return true;
  } catch (error) {
    console.error('Erro durante o processo de migração:', error);
    throw error;
  }
}

runMigrations()
  .then(() => {
    console.log('Processo de migração concluído.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Erro durante o processo de migração:', error);
    process.exit(1);
  }); 