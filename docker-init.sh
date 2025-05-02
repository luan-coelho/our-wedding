#!/bin/bash

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
  echo "Arquivo .env não encontrado. Criando um arquivo .env a partir do exemplo..."
  echo "# Database
DATABASE_URL=\"postgresql://postgres:postgres@db:5432/ourwedding?schema=public\"

# NextAuth
NEXTAUTH_URL=\"http://localhost:3000\"
NEXTAUTH_SECRET=\"$(openssl rand -base64 32)\"

# Admin User (para criação do usuário admin)
ADMIN_EMAIL=\"admin@gmail.com\"
ADMIN_PASSWORD=\"admin123\"" > .env
  echo "Arquivo .env criado!"
fi

# Iniciar os containers
docker compose up -d

# Aguardar o banco de dados iniciar
echo "Aguardando o banco de dados iniciar..."
sleep 10

# Gerar o cliente Prisma
echo "Gerando cliente Prisma..."
docker compose exec app npx --yes prisma@6.7.0 generate

# Executar as migrações do Prisma
echo "Executando migrações do Prisma..."
docker compose exec app npx --yes prisma@6.7.0 migrate deploy

# Criar usuário admin
echo "Criando usuário administrador..."
docker compose exec app npx --yes tsx scripts/create-admin.ts

echo "Aplicação iniciada com sucesso!"
echo "Acesse: http://localhost:3000" 