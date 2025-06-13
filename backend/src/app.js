require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const dataRoutes = require('./routes/data.routes');
const assetsRoutes = require('./routes/assets.routes'); // Importe as novas rotas de assets
const cors = require('cors'); // Importe o middleware CORS

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao banco de dados
connectDB();

// Middlewares
app.use(cors()); // Habilita CORS para todas as rotas. Para produção, configure de forma mais restritiva.
app.use(express.json()); // Para parsear JSON no corpo da requisição
app.use(express.urlencoded({ extended: true })); // Para parsear dados de formulário (necessário para Multer)

// Configurar o Express para servir arquivos estáticos
// O caminho '/assets' na URL (ex: localhost:3000/assets/...) corresponderá ao diretório ASSETS_PATH dentro do contêiner
const ASSETS_BASE_DIR = process.env.ASSETS_PATH || path.join(__dirname, '..', 'assets_data');
console.log(`Servindo arquivos estáticos de: ${ASSETS_BASE_DIR}`);
app.use('/assets', express.static(ASSETS_BASE_DIR));

// Rotas da API de dados (CRUD do MongoDB)
app.use('/data', dataRoutes);

// Rotas da API de assets (upload de arquivos)
app.use('/assets', assetsRoutes); // Use as novas rotas para /assets/upload

// Rota de teste
app.get('/', (req, res) => {
  res.send('Backend está funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});