# Node.js 应用
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN sed -i '/"prepare":/d' package.json || true
RUN HUSKY=0 npm ci --omit=dev && npm cache clean --force
COPY . .

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
