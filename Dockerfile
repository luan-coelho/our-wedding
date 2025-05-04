# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

# Habilita o Corepack e ativa versão específica do pnpm
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

# Etapa de dependências
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl coreutils postgresql-client
WORKDIR /app

# Copia arquivos necessários para instalar dependências
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

# Etapa de build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gera o cliente do Prisma
RUN npx prisma generate

# Desabilita telemetria do Next.js
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# Etapa de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV AUTH_TRUST_HOST=true

# Ferramentas úteis
RUN apk add --no-cache coreutils postgresql-client

# Adiciona usuário seguro para rodar o app
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copia arquivos necessários do build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.pnpm/@prisma+client*/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
