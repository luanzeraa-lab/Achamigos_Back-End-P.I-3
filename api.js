require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')
const multer = require("multer");
const fs = require("fs");
const User = require('./models/User')

const app = express();

app.use(express.json());
app.use(cors(["*"]));
app.use('/public', express.static(`${__dirname}/public`));

const port = 3002;

//----------------CONEXÃO COM MONGO------------
const connectDB = async () =>{
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conexão com o banco de dados bem sucedida")
  } catch (error) {

    console.log("Erro: ", error)
  }
};
connectDB()


//---------SALVAMENTO DE IMAGENS----------
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, `${__dirname}/public`)
  },
  filename: function(req, file, cb){
    cb(null, Date.now() +".jpg");
  }
});
const upload = multer({storage})

//-------CADASTRO ANIMAIS----------------
let contadorAnimal = 0;
let animals =[];

app.post("/animais", upload.single("imagem"), async (req, res)=>{
  const newAnimal = {
    id: contadorAnimal++,
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

//---------CADASTRO USUÁRIO---------------
let users = [];
let contadorUser = 0;

app.post('/users', async (req,res) =>{
  try {
    const {nome, telefone, cnpj, userLogin, senha, email, endereco, tipo, userStatus} = req.body;
    
    const userExist = await User.findOne({email});
    if (userExist){
      return res.status(400).json({message: "Email já cadastrado"})
    }

    const newUser = new User({nome, telefone, cnpj, userLogin, senha, email,
       endereco, tipo, userStatus})
       await newUser.save();
       res.status(201).json({message: "Usuário cadastrado com sucesso"})

  } catch (error) {
    res.status(400).json.apply({error: "Erro ao cadastrar"})
  }
})
app.listen (port, ()=>{
    console.log(`servidor iniciado com sucesso na porta ${port}`);
});