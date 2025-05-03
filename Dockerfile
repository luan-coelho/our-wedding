FROM node:slim

RUN apt-get update -y \
    && apt-get install -y openssl

# Instalar pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Usar pnpm para instalar dependências
RUN pnpm install --frozen-lockfile

COPY . .

RUN npx prisma generate

RUN pnpm build

# Setup para o modo standalone do Next.js
RUN mkdir -p /app/.next/standalone/public
RUN cp -r /app/public /app/.next/standalone/
RUN cp -r /app/.next/static /app/.next/standalone/.next/

ENV NODE_ENV=production
ENV PORT=3000

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"] 