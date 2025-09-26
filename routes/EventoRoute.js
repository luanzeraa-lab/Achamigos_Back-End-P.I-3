const express = require('express');
const router = express.Router();
const multer = require("multer");
const EventoController = require('../controllers/EventoController');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, __dirname + "/../public");;
  },
  filename: function(req, file, cb){
    cb(null, Date.now() +".jpg");
  }
});
const upload = multer({storage})
    

router.post('/cadastroeventos', upload.single('imagem'), EventoController.cadastrarEvento);
router.put('/cadastroeventos/:id', EventoController.alterarEvento);
router.delete('/cadastroeventos/:id', EventoController.excluirEvento);

module.exports = router;
