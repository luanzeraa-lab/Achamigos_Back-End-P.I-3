const express = require('express');
const router = express.Router();
const multer = require("multer");
const animalController = require('../controllers/AnimalController')


 const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, __dirname + "/../public");;
  },
  filename: function(req, file, cb){
    cb(null, Date.now() +".jpg");
  }
});
const upload = multer({storage})
    
router.get('/cadastroanimal', (animalController.listarAnimal));
router.post('/cadastroanimal', upload.single('imagem'), animalController.cadastrarAnimal);
router.put('/cadastroanimal/:id', (animalController.alterarAnimal));
router.delete('/cadastroanimal/:id', (animalController.excluirAnimal));


module.exports = router;