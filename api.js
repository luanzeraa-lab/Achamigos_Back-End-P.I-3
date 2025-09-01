require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')
const multer = require("multer");
const fs = require("fs");
const User = require('./models/User')
const Animal = require('./models/Animal')
const Evento = require('./models/Evento')
const Vacina = require ('./models/Vacina')

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


// app.post("/animais", upload.single("imagem"), async (req, res)=>{
  //   const newAnimal = {
    //     id: contadorAnimal++,
    //     nome: req.body.nome,
    //     idade: req.body.idade,
    //     raca: req.body.raca,
    //     sexo: req.body.sexo,
    //     porte: req.body.porte,
    //     peso: req.body.peso,
    //     observacoes: req.body.observacoes,
    //     castracao: req.body.castracao,
    //     imagem:req.file ? req.file.filename : null
    //   };
    
    //   animals.push(newAnimal);
    //   res.status(201).json(newAnimal);
    // });
    // app.get("/animais", (req, res) => {
    //   res.json(animals);
    // });
    
    
    //-------CADASTRO ANIMAIS----------------
    let contadorAnimal = 0;
    let animals =[];
    
app.post('/cadastroanimal', upload.single("imagem"), async (req, res) =>{
  try {
    const {nome, idade, raca, sexo, porte, peso, 
      observacoes, castracao, imagem} = req.body;

      const newAnimal = new Animal ({nome, idade, raca, sexo, 
      porte, peso, observacoes, castracao, 
      imagem:req.file ? `/public/${req.file.filename}` : null})

      await newAnimal.save();
      res.status(201).json({message: "Animal cadastrado com sucesso"})  
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

app.get('/cadastroanimal', async (req, res) =>{
  try {
    const animals = await Animal.find();
    res.status(200).json({animals})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

app.put('/cadastroanimal', async (req, res) =>{
  
  try {
    const {id} = req.query;
    const {nome, idade, raca, sexo, porte, peso, 
      observacoes, castracao} = req.body;

      const animalAtualizado = await Animal.findByIdAndUpdate(
        id,
        {nome, idade, raca, sexo, porte, peso, observacoes, castracao},
        {new: true});
        res.json(animalAtualizado);
      } catch (error) {
        res.status(400).json({error: "Erro ao atualizar"})
      }
})

//---------CADASTRO USUÁRIO---------------

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

//--------------LOGIN----------
app.post('/login', async(req, res) =>{
  const {email, senha} = req.body;

  const emailExist = await User.findOne({email});
  if(!emailExist){
    return res.status(400).json({message: "Email não cadastrado"})
  }
  const password = await User.findOne({senha});
  if(!password){
    return res.status(400).json({message: "Senha incorreta"})
  }

  res.status(200).json({message: "Login realizado com sucesso"})
})

//-----------------CADASTRO EVENTOS------------
app.post('/cadastroeventos',  upload.single('imagem'), async (req, res) =>{
  try {
    const { idEvento, idUsuario, data_Publicacao, data_Exclusao, tipo_Evento, 
      texto, eventoStatus} = req.body;
      const newEvento = new Evento({idEvento, idUsuario, data_Publicacao, data_Exclusao, tipo_Evento, 
        texto, eventoStatus, imagem:req.file ? `/public/${req.file.filename}` : null});
        await newEvento.save();
        res.status(200).json({message: "Evento cadastrado com sucesso!!!"})
      } catch (error) {
        res.status(400).json({error: "Erro ao cadastrar evento"})
      }     
});

//------------------CADASTRO VACINAS-------
app.post('/cadastrovacinas', async (req, res) =>{
  try {
    const {codVacina, idUsuario, nome, duracao} = req.body;
    const newVacina = new Vacina({codVacina, idUsuario, nome, duracao})
    await newVacina.save();
    res.status(200).json({message: "Vacina cadastrada com sucesso!!!"})
  } catch (error) {
    res.status(400).json({error: "Erro ao cadastrar vacina"})
  }
  })

app.listen (port, ()=>{
    console.log(`servidor iniciado com sucesso na porta ${port}`);
});