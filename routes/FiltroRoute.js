const express = require('express');
const router = express.Router();
const FiltroController = require('../controllers/FiltroController')

router.get('/animais/cidade/:cidade', FiltroController.filtrarAnimais);

module.exports = router;