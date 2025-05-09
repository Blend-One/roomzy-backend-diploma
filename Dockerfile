FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:18-alpine as runtime

WORKDIR /app

COPY package*.json ./

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

RUN apk add chromium

EXPOSE 8080

CMD ["npm", "run", "start:migrate:prod"]
