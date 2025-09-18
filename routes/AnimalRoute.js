const express = require('express');
const router = express.Router();
const animalController = require('../controllers/AnimalController')

router.post('/cadastroanimal', animalController.cadastrarAnimal);
router.put('/cadastroanimal', async (animalController.alterarAnimal));
router.get('/cadastroanimal', async (animalController.listarAnimal));
router.delete('/cadastroanimal', async (animalController.deletarAnimal));


module.exports = router;