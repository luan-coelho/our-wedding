FROM node:20-alpine AS base

# Instalar dependências necessárias para o Prisma e outras bibliotecas
RUN apk add --no-cache libc6-compat openssl

# Configurar o diretório de trabalho
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Camada de dependências
FROM base AS deps
WORKDIR /app

# Copiar arquivos de configuração de dependências
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# Instalar dependências
RUN pnpm install --frozen-lockfile
RUN npx prisma generate

# Camada de build
FROM base AS builder
WORKDIR /app

# Copiar dependências da camada anterior
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src/generated ./src/generated

# Copiar o código fonte
COPY . .

# Variáveis de ambiente para o build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build da aplicação
RUN pnpm build --no-lint

# Camada de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar apenas os arquivos necessários para execução
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Instalar apenas as dependências de produção necessárias
RUN pnpm install --prod --ignore-scripts
RUN npx prisma generate

# Definir usuário para execução
USER nextjs

# Expor a porta que a aplicação usa
EXPOSE 3000

# Definir variáveis de ambiente para a aplicação
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Comando para iniciar a aplicação
CMD ["node", "server.js"] 