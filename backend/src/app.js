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