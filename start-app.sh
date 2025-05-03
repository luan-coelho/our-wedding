#!/bin/bash

echo "============================================"
echo "Iniciando a aplicação Our Wedding..."
echo "============================================"

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null || ! command -v docker compose &> /dev/null; then
    echo "Erro: Docker e/ou Docker Compose não estão instalados."
    echo "Por favor, instale-os antes de continuar."
    exit 1
fi

# Se a aplicação já estiver rodando, pergunte se deseja reiniciar
if docker compose ps | grep -q "app"; then
    echo "A aplicação já está em execução."
    read -p "Deseja reiniciá-la? (s/n): " resposta
    
    if [[ "$resposta" =~ ^[Ss]$ ]]; then
        read -p "Deseja remover os volumes também (isso apagará o banco de dados)? (s/n): " limpar_volumes
        
        if [[ "$limpar_volumes" =~ ^[Ss]$ ]]; then
            echo "Reiniciando a aplicação e removendo volumes..."
            docker compose down -v
        else
            echo "Reiniciando a aplicação..."
            docker compose down
        fi
    else
        echo "Operação cancelada."
        exit 0
    fi
fi

# Limpar cache do Docker BuildKit (opcional, em caso de problemas de build)
read -p "Deseja limpar o cache do Docker para forçar reconstrução completa? (s/n): " limpar_cache
if [[ "$limpar_cache" =~ ^[Ss]$ ]]; then
    echo "Limpando cache do Docker..."
    docker builder prune -f
fi

# Construir e iniciar os containers
echo "Construindo e iniciando os containers..."
# docker compose up -d --build
docker compose up --build

# Verificar se os containers iniciaram corretamente
if [ $? -eq 0 ]; then
    echo "============================================"
    echo "Aplicação iniciada com sucesso!"
    echo "Acesse: http://localhost:3000"
    echo "Prisma Studio (interface do banco): http://localhost:5555"
    echo ""
    echo "Credenciais de administrador:"
    echo "  - Email: admin@gmail.com"
    echo "  - Senha: admin"
    echo "IMPORTANTE: Altere essa senha após o primeiro login."
    echo "============================================"
else
    echo "Erro ao iniciar a aplicação. Verifique os logs com 'docker compose logs'."
    exit 1
fi

# Mostrar os logs da aplicação
read -p "Deseja visualizar os logs da aplicação? (s/n): " mostrar_logs
if [[ "$mostrar_logs" =~ ^[Ss]$ ]]; then
    docker compose logs -f app
fi 