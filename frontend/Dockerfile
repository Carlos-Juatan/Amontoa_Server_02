FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage de produção para servir os arquivos estáticos
FROM nginx:alpine

# Remove o arquivo de configuração padrão do Nginx para evitar conflitos (boa prática)
# Isso é importante porque o Nginx carregaria seu default.conf E o dele, causando potencialmente mais conflitos.
RUN rm /etc/nginx/conf.d/default.conf 

# Copia a configuração PERSONALIZADA do Nginx (apenas o bloco server) para o local correto
COPY nginx-app.conf /etc/nginx/conf.d/default.conf 
# ^^^ Mudei o nome aqui para 'nginx-app.conf' se você criar o arquivo com esse nome.
#     Se você ainda chamar de 'nginx.conf', mantenha 'COPY nginx.conf ...'

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]