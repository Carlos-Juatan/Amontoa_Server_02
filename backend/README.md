
# Estrutura de Pastas:

├── backend
│   ├── src
│   │   ├── app.js
│   │   ├── routes
│   │   │   └── data.routes.js
│   │   ├── controllers
│   │   │   └── data.controller.js
│   │   └── config
│   │       └── db.js
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── docker-compose.yml
└── .env

# 1. Arquivo .env (na raiz do projeto):

```Snippet de código
MONGODB_URI=mongodb://mongodb:27017
# Se o seu MongoDB tiver autenticação, use:
# MONGODB_URI=mongodb://user:password@mongodb:27017
PORT=3000
```

# 2. Arquivo .env.example (para controle de versão - dentro da pasta backend):

```Snippet de código
MONGODB_URI=mongodb://localhost:27017/
PORT=3000
```
# 3. backend/package.json:


```JSON
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Backend para Docker Compose com MongoDB",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  },
  "dependencies": {
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "mongoose": "^8.15.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

# 4. backend/src/app.js:

```JavaScript
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const dataRoutes = require('./routes/data.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao banco de dados
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Rotas
app.use('/data', dataRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('Backend está funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

# 5. backend/src/config/db.js:

```JavaScript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI não definida no .env');
    }
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout após 5s se não conseguir conectar
    });
    console.log('MongoDB conectado com sucesso!');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err.message);
    process.exit(1); // Sair do processo com erro
  }
};

module.exports = connectDB;
```

# 6. backend/src/routes/data.routes.js:

```JavaScript
const express = require('express');
const { getData, createData, updateData, deleteData } = require('../controllers/data.controller');
const router = express.Router();

// Rotas dinâmicas para coleções
router.get('/:collectionName', getData);
router.post('/:collectionName', createData);
router.put('/:collectionName/:id', updateData);
router.delete('/:collectionName/:id', deleteData);

module.exports = router;
```

# 7. backend/src/controllers/data.controller.js:

```JavaScript
const mongoose = require('mongoose');

// Função auxiliar para obter o modelo dinamicamente
const getModel = (collectionName) => {
  // Garante que o nome da coleção está em camelCase para ser usado como nome de modelo
  const modelName = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);
  if (mongoose.models[modelName]) {
    return mongoose.model(modelName);
  }
  // Se o modelo não existe, cria um Schema genérico para a coleção
  const schema = new mongoose.Schema({}, { strict: false, collection: collectionName });
  return mongoose.model(modelName, schema);
};

// Obter dados de uma coleção específica
exports.getData = async (req, res) => {
  const { collectionName } = req.params;
  try {
    const Model = getModel(collectionName);
    const data = await Model.find();
    res.json(data);
  } catch (err) {
    console.error(`Erro ao obter dados da coleção ${collectionName}:`, err.message);
    res.status(500).json({ message: 'Erro do servidor', error: err.message });
  }
};

// Criar novo dado em uma coleção específica
exports.createData = async (req, res) => {
  const { collectionName } = req.params;
  try {
    const Model = getModel(collectionName);
    const newData = new Model(req.body);
    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    console.error(`Erro ao criar dado na coleção ${collectionName}:`, err.message);
    res.status(400).json({ message: 'Erro ao criar dado', error: err.message });
  }
};

// Atualizar dado em uma coleção específica
exports.updateData = async (req, res) => {
  const { collectionName, id } = req.params;
  try {
    const Model = getModel(collectionName);
    const updatedData = await Model.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedData) {
      return res.status(404).json({ message: 'Dado não encontrado' });
    }
    res.json(updatedData);
  } catch (err) {
    console.error(`Erro ao atualizar dado na coleção ${collectionName}:`, err.message);
    res.status(400).json({ message: 'Erro ao atualizar dado', error: err.message });
  }
};

// Deletar dado de uma coleção específica
exports.deleteData = async (req, res) => {
  const { collectionName, id } = req.params;
  try {
    const Model = getModel(collectionName);
    const deletedData = await Model.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).json({ message: 'Dado não encontrado' });
    }
    res.json({ message: 'Dado deletado com sucesso' });
  } catch (err) {
    console.error(`Erro ao deletar dado da coleção ${collectionName}:`, err.message);
    res.status(500).json({ message: 'Erro ao deletar dado', error: err.message });
  }
};
```

# 8. backend/Dockerfile:

```Dockerfile
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
```

# 9. docker-compose.yml (na raiz do seu projeto):


```YAML
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      # Passa as variáveis de ambiente do .env para o contêiner do backend
      MONGODB_URI: ${MONGODB_URI}
      PORT: ${PORT}
    networks:
      - app-network
    depends_on:
      - mongodb # Garante que o MongoDB inicie antes do backend

  # Seu serviço MongoDB existente (exemplo - ajuste conforme o seu)
  mongodb:
    image: mongo:latest
    container_name: meu_mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db # Persistência de dados
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongo_data:
```









```JavaScript
```