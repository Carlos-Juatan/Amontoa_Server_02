const express = require('express');
const { getData, createData, updateData, deleteData } = require('../controllers/data.controller');
const router = express.Router();

// Rotas dinâmicas para coleções
router.get('/:collectionName', getData);
router.post('/:collectionName', createData);
router.put('/:collectionName/:id', updateData);
router.delete('/:collectionName/:id', deleteData);

module.exports = router;