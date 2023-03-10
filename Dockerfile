FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

FROM node:16-alpine AS runner
WORKDIR /app

RUN yarn global add pnpm

COPY ./deploy/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
COPY --from=builder /app/package.json /app/.env /app/tsconfig.json /app/tsconfig.paths.json .
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/node_modules ./node_modules

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["yarn", "start:prod"]