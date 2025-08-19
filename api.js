const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");


const app = express();

app.use(express.json());
app.use(cors(["*"]));
app.use('/public', express.static(`${__dirname}/public`));

const port = 80;



let contadorA = 0;
let animals =[];

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, `${__dirname}/public`)
  },
  filename: function(req, file, cb){
    cb(null, Date.now() +".jpg");
  }
});

const upload = multer({storage})

app.post("/animais", upload.single("imagem"), (req, res)=>{
  const newAnimal = {
    id: contadorA++,
    nome: req.body.nome,
    idade: req.body.idade,
    raca: req.body.raca,
    sexo: req.body.sexo,
    porte: req.body.porte,
    peso: req.body.peso,
    observacoes: req.body.observacoes,
    castracao: req.body.castracao,
    imagem:req.file ? req.file.filename : null
  };

  animals.push(newAnimal);
  res.status(201).json(newAnimal);
});


app.get("/animais", (req, res) => {
  res.json(animals);
});

app.listen (port, ()=>{
    console.log(`servidor iniciado com sucesso na porta ${port}`);
});