# Estágio 1: Build do Frontend
FROM node:22-alpine AS build

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Compilar o frontend (gera a pasta dist/)
RUN npm run build

# Estágio 2: Hospedagem com Nginx
FROM nginx:alpine

# Copiar arquivos estáticos do build anterior para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
