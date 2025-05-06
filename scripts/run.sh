#!/bin/sh
set -e

echo "Aguardando o banco de dados ficar disponível..."
sleep 5

# Verificar conexão com o banco de dados
echo "Verificando conexão com o banco de dados..."
max_tentativas=30
tentativas=0

while [ $tentativas -lt $max_tentativas ]; do
  if pg_isready -h postgres_db -U $POSTGRES_USER; then
    echo "Banco de dados está pronto!"
    break
  fi
  tentativas=$((tentativas+1))
  echo "Tentativa $tentativas de $max_tentativas: Banco de dados não está pronto. Aguardando..."
  sleep 2
done

if [ $tentativas -eq $max_tentativas ]; then
  echo "Não foi possível conectar ao banco de dados após $max_tentativas tentativas."
  exit 1
fi

# Verificar se a pasta drizzle/meta existe
if [ ! -d "/app/drizzle/meta" ]; then
  echo "Criando diretório de metadados de migração..."
  mkdir -p /app/drizzle/meta
fi

# Verificar se o arquivo journal existe
if [ ! -f "/app/drizzle/meta/_journal.json" ]; then
  echo "Criando arquivo journal..."
  echo '{"version":"5","dialect":"pg","entries":[]}' > /app/drizzle/meta/_journal.json
fi

# Verificar variáveis de ambiente relacionadas ao banco de dados
echo "Verificando variáveis de ambiente para o banco de dados:"
echo "DATABASE_URL=${DATABASE_URL:-(não definido)}"
echo "POSTGRES_USER=${POSTGRES_USER:-(não definido)}"
echo "POSTGRES_DB=${POSTGRES_DB:-(não definido)}"
echo "POSTGRES_HOST=postgres_db (esperado)"

# Testar conexão direta com o PostgreSQL usando psql
echo "Testando conexão com PostgreSQL usando psql..."
if PGPASSWORD=$POSTGRES_PASSWORD psql -h postgres_db -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT 1" >/dev/null 2>&1; then
  echo "Conexão usando psql bem-sucedida!"
else
  echo "FALHA na conexão usando psql. Verifique as credenciais."
fi

# Listar arquivos na pasta de migrações para debug
echo "Arquivos na pasta de migrações:"
ls -la /app/drizzle/
ls -la /app/drizzle/meta/

# Executar as migrações do Drizzle usando o script dedicado
echo "Executando migrações do Drizzle..."
cd /app/scripts
node drizzle-migrate.mjs
MIGRATION_STATUS=$?

# Verificar se a migração foi bem-sucedida
if [ $MIGRATION_STATUS -ne 0 ]; then
  echo "Erro ao executar migrações. Tentando iniciar a aplicação mesmo assim..."
else
  echo "Migrações executadas com sucesso!"
fi

cd /app

# Iniciar a aplicação Next.js
echo "Iniciando a aplicação Next.js..."
exec node server.js 