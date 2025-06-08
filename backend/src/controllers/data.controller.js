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