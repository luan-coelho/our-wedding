# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar e habilitar o pnpm
RUN corepack enable pnpm
# set the store dir to a folder that is not in the project
RUN pnpm config set store-dir ~/.pnpm-store
RUN pnpm fetch

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml* ./
# Instalar dependências usando pnpm
RUN pnpm install --frozen-lockfile --prefer-offline

# Configurar dependências de scripts separadamente
WORKDIR /app/scripts
COPY scripts/package.json ./
RUN pnpm install --prefer-offline

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/scripts/node_modules ./scripts/node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# Habilitar pnpm e executar build
RUN corepack enable pnpm && pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV AUTH_TRUST_HOST=true

# Instalar ferramentas necessárias
RUN apk add --no-cache postgresql-client

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar configurações e arquivos necessários
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/public ./public

# Copiar a pasta drizzle e garantir que todos os arquivos sejam copiados corretamente
COPY --from=builder /app/drizzle ./drizzle

# Se o diretório meta não existir, crie-o
RUN mkdir -p ./drizzle/meta

# Copiar outros arquivos necessários
COPY --from=builder /app/src/db ./src/db

# Criar diretório scripts e copiar arquivos
RUN mkdir -p /app/scripts
COPY --from=builder /app/scripts/drizzle-migrate.mjs ./scripts/
COPY --from=builder /app/scripts/package.json ./scripts/
COPY --from=builder /app/scripts/node_modules ./scripts/node_modules

# Criar o script de inicialização diretamente na raiz do app
COPY --from=builder /app/scripts/run.sh ./
RUN chmod +x ./run.sh

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Definir permissões adequadas
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js é criado pelo next build a partir da saída standalone
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["./run.sh"]