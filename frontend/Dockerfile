# Build bosqichi (Node.js)
FROM node:22-alpine AS build
WORKDIR /app

# Paket fayllarini nusxalaymiz
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Kodni nusxalaymiz va ishlab chiqarish (production) uchun yig'amiz
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npx vite build

# Ishga tushirish bosqichi (Nginx)
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Build qilingan fayllarni Nginx papkasiga ko'chiramiz
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
