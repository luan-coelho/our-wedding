# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

# Instalar dependências somente quando necessário
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat openssl coreutils postgresql-client
WORKDIR /app

# Instalar dependências
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Reconstruir o código fonte apenas quando necessário
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gerar o cliente do Prisma
RUN npx prisma generate

# Desabilitar telemetria do Next.js (opcional)
ENV NEXT_TELEMETRY_DISABLED 1

RUN corepack enable pnpm && pnpm build

# Imagem de produção, copiar todos os arquivos e executar o next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Ferramentas para diagnóstico e migração
RUN apk add --no-cache coreutils postgresql-client

# Adicionar usuário do sistema para execução do Next.js
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos públicos
COPY --from=builder /app/public ./public

# Definir permissões corretas para cache de pré-renderização
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automaticamente aproveitar os traces de saída para reduzir o tamanho da imagem
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar prisma schema e migrações para o container final
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.pnpm/@prisma+client*/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
# Configuração recomendada para Auth.js em ambiente Docker
ENV AUTH_TRUST_HOST true

CMD ["node", "server.js"]