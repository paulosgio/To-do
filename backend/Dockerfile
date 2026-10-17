# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app

# O prisma.config.ts exige DATABASE_URL até para o `prisma generate`
# (que não conecta ao banco). Valor fictício só para este estágio.
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build

# Schema e config antes do `npm ci`, pois o postinstall roda `prisma generate`.
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- runtime ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# node_modules completo: o CLI do Prisma (devDependency) é necessário
# para aplicar as migrations na inicialização do contêiner.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json prisma.config.ts ./
COPY prisma ./prisma

USER node
EXPOSE 3333
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
