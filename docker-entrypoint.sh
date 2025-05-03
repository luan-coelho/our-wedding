#!/bin/sh

# Esperar pelo PostgreSQL
echo "Esperando pelo PostgreSQL..."
while ! pg_isready -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER; do
  sleep 1
done

# Executar migrações do Prisma
echo "Executando migrações do Prisma..."
cd /app && npx prisma migrate deploy

# Criar usuário administrador usando o script Node.js
echo "Criando usuário administrador..."
cd /app && npx tsx src/scripts/create-admin.ts

# Iniciar aplicação Next.js
echo "Iniciando aplicação..."
exec node server.js 