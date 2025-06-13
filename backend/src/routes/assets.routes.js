const express = require('express');
const { uploadFile } = require('../controllers/assets.controller'); // Importa a função de upload
const router = express.Router();

// Rota para upload de arquivos
// A URL será /assets/upload/:folderName
// :folderName é um parâmetro da URL que define a subpasta onde o arquivo será salvo.
router.post('/upload/:folderName', uploadFile);

module.exports = router;