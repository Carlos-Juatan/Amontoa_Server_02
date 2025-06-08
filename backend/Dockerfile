# Usa uma imagem oficial do Node.js
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia o package.json e package-lock.json (se existir)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código-fonte
COPY . .

# Expõe a porta que a aplicação Express irá ouvir
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]