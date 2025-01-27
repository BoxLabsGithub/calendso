FROM node:14 as deps

WORKDIR /app
COPY package.json yarn.lock ./
COPY prisma prisma
RUN yarn install --frozen-lockfile

FROM node:14 as builder

WORKDIR /app
ARG BASE_URL
ENV BASE_URL $BASE_URL
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL $NEXT_PUBLIC_APP_URL

COPY . .

COPY --from=deps /app/node_modules ./node_modules
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

FROM node:14 as runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY  scripts scripts

EXPOSE 3000
CMD ["npm","start"]


# docker buildx build --build-arg BASE_URL=http://localhost:3000 --build-arg NEXT_PUBLIC_APP_URL=http://localhost:3000 --platform linux/amd64 .
