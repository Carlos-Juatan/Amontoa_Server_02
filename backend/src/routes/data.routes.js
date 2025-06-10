const express = require('express');
const { getData, getDataById, createData, updateData, deleteData } = require('../controllers/data.controller'); // Importe getDataById
const router = express.Router();

// Rota para obter um item por ID
router.get('/:collectionName', getData);
router.get('/:collectionName/:id', getDataById);
router.post('/:collectionName', createData);
router.put('/:collectionName/:id', updateData);
router.delete('/:collectionName/:id', deleteData);

module.exports = router;