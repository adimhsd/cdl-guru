# Menggunakan Node.js versi 18 Alpine yang ringan sebagai base image
FROM node:18-alpine AS base

# Install dependencies yang dibutuhkan oleh beberapa module Node.js
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Tahap 1: Install semua dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Gunakan ci untuk instalasi yang clean berdasarkan package-lock.json
RUN npm ci

# Tahap 2: Build aplikasi
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client agar bisa digunakan saat build & runtime
RUN npx prisma generate

# PENTING: Pastikan next.config.mjs atau next.config.js Anda memiliki "output: 'standalone'"
RUN npm run build

# Tahap 3: Production image
FROM base AS runner
WORKDIR /app

# Atur environment menjadi production
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Membuat user non-root untuk keamanan
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set folder public jika ada (untuk aset statis)
COPY --from=builder /app/public ./public

# Salin output standalone dan static dari builder
# Jika terjadi error saat build, pastikan Anda menambahkan `output: "standalone"` di next.config.js/mjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Setup folder prisma jika diperlukan pada runtime (walau query biasa pakai schema hasil generate)
# COPY --from=builder /app/prisma ./prisma

# Switch ke non-root user
USER nextjs

EXPOSE 3000

# Perintah start untuk standalone build
CMD ["node", "server.js"]
