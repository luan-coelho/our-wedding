# Stage 1: Base
FROM node:20-alpine AS base

# Alpine já inclui o libc6-compat necessário para o Prisma
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate

# Stage 2: Dependencies
FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 3: Builder
FROM base AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Configurar ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Gerar o cliente Prisma
RUN npx prisma generate
RUN pnpm build

# Stage 4: Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuário para executar a aplicação
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar os arquivos necessários
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

# Instalar cliente PostgreSQL para verificação de disponibilidade
RUN apk add --no-cache postgresql-client

RUN chmod +x /app/docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["/app/docker-entrypoint.sh"] 