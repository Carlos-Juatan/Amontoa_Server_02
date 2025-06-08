const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI não definida no .env');
    }
    // As opções useNewUrlParser e useUnifiedTopology foram removidas
    // pois não são mais necessárias em versões recentes do Mongoose/Driver
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000 // Timeout após 5s se não conseguir conectar
    });
    console.log('MongoDB conectado com sucesso!');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err.message);
    process.exit(1); // Sair do processo com erro
  }
};

module.exports = connectDB;