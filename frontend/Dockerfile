# ---------- Stage 1: Build ----------
FROM node:20-alpine AS build

WORKDIR /app

# اول فقط package فایل‌ها رو کپی کن تا کش داکر بهینه بمونه
COPY package*.json ./
RUN npm ci

# حالا بقیه سورس رو کپی کن و بیلد بگیر
COPY . .
RUN npm run build
# خروجی این مرحله توی /app/dist قرار می‌گیره (پیش‌فرض Vite)

# ---------- Stage 2: Serve ----------
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
