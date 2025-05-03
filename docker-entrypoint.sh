#!/bin/sh

# Aguarda alguns segundos para garantir que o PostgreSQL esteja pronto
echo "Waiting for PostgreSQL to be fully ready..."
sleep 5

# Executa as migrações do Prisma
echo "Running migrations..."
npx prisma migrate deploy

# Regenera o cliente do Prisma
echo "Generating Prisma client..."
npx prisma generate

# Inicia a aplicação
echo "Starting application..."
# Verifica se estamos usando a configuração standalone e inicia de acordo
if [ -f ".next/standalone/server.js" ]; then
  echo "Using standalone server..."
  node .next/standalone/server.js
else
  echo "Using pnpm start..."
  pnpm start
fi 