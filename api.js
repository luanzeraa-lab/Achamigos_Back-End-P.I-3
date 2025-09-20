require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')
const multer = require("multer");
const fs = require("fs");
const User = require('./models/User')
const Animal = require('./models/AnimalModel')
const Evento = require('./models/Evento')
const Vacina = require ('./models/Vacina');
const { ppid } = require('process');
console.log("MONGO_URI =", process.env.MONGO_URI);
const animalRoute = require('./routes/AnimalRoute');
// const userRoute = require('./routes/UserRoute');
// const eventoRoute = require('./routes/EventoRoute');

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use('/public', express.static(`${__dirname}/public`));

app.use(animalRoute);
// app.use(userRoute);
// app.use(eventoRoute);

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
    

    //-------CADASTRO ANIMAIS----------------ok
    

app.get('/cadastroanimal', async (req, res) =>{
  try {
    const animals = await Animal.find();
    if(animals.length == 0){
      res.status(400).json({message:"Nenhum animal cadastrado"})
    }
    res.status(200).json(animals)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

// app.put('/cadastroanimal', async (req, res) =>{
  
//   try {
//     const {id} = req.query;
//     const {nome, idade, raca, sexo, porte, peso, 
//       observacoes, castracao} = req.body;

//       const animalAtualizado = await Animal.findByIdAndUpdate(
//         id,
//         {nome, idade, raca, sexo, porte, peso, observacoes, castracao},
//         {new: true});
//         res.json(animalAtualizado);
//       } catch (error) {
//         res.status(400).json({error: "Erro ao atualizar"})
//       }
// })

app.delete('/cadastroanimal', async (req, res) =>{
  try {
    const {id} = req.query;
    const animalDeletado = await Animal.findByIdAndDelete(id)
    if (!animalDeletado){
      return res.status(400).json({message: "Animal não encontrado"})
    }
    res.status(200).json({message: "Animal deletado com sucesso"})
  } catch (error) {
    res.status(400).json({error: "Erro ao deletar animal"})
  }
})

//---------CADASTRO USUÁRIO---------------ok

app.post('/users', async (req,res) =>{
  try {
    const {nome, telefone, cnpj, userLogin, senha, email, endereco, tipo, userStatus, linkUser} = req.body;
    
    const userExist = await User.findOne({email});
    if (userExist){
      return res.status(400).json({message: "Email já cadastrado"})
    }

    const newUser = new User({nome, telefone, cnpj, userLogin, senha, email,
       endereco, tipo, userStatus, linkUser})
       await newUser.save();
       res.status(201).json({message: "Usuário cadastrado com sucesso"})

  } catch (error) {
    console.log(error);
    res.status(400).json({error: "Erro ao cadastrar"})
  }
})

app.get('/users', async (req, res) =>{
  try {
    const usuarios = await User.find();
    if (usuarios.length == 0){
      return res.status(400).json({message: "Nenhum usuário encontrado"})
    }
    res.status(200).json(usuarios)

  } catch (error) {
    res.status(500).json({error: "Erro ao buscar usuários"})
  }
})

app.put('/users', async (req, res) =>{
  try {
    const {id} = req.query;
    const {nome, telefone, cnpj, userLogin, senha, email,
           endereco, tipo, userStatus, linkUser} = req.body;
    const usuarioAtualizado = await User.findByIdAndUpdate(
      id,
      {nome, telefone, cnpj, userLogin, senha, email,
       endereco, tipo, userStatus, linkUser},
       {new: true})
       if (!usuarioAtualizado){
        return res.status(400).json({message: "Usuário não encontrado"})
       }
       res.status(200).json(usuarioAtualizado) 
    } catch (error) {
       res.status(400).json({error: "Erro"})
    }
})

app.delete('/users', async (req, res) =>{
  try {
    const {id} = req.query;
    const usuarioDeletado = await User.findByIdAndDelete(id)
       if (!usuarioDeletado){
        return res.status(400).json({message: "Usuário não encontrado"})
       }
       res.status(200).json(usuarioDeletado) 
    } catch (error) {
       res.status(400).json({error: "Erro"})
    }
})

//--------------LOGIN----------
app.post('/login', async(req, res) =>{
  try {
    const {email, senha} = req.body;
    const usuario = await User.findOne({email, senha});
    if(!usuario){
      return res.status(400).json({message: "Dados do usuario incorretos"})
    }
    res.status(200).json({message: "Login realizado com sucesso"})
  } catch (error) {
    res.status(500).json({error: "Erro ao realizar login"})
  }
});

  //--------------------CADASTRO EVENTOS------------ok
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

  app.put('/cadastroeventos', async (req, res) =>{
  try {
    const {id} = req.query;
    const {idEvento, idUsuario, data_Publicacao, data_Exclusao, tipo_Evento, 
      texto, eventoStatus} = req.body;
    
    const eventoAtualizado = await Evento.findByIdAndUpdate(
      id,
      {idEvento, idUsuario, data_Publicacao, data_Exclusao, tipo_Evento, 
      texto, eventoStatus},
      {new: true}
    )  
    if(!eventoAtualizado){
      return res.status(400).json({message: "Evento não encontrado"})
    }
    res.status(200).json({message:"Evento atualizado com sucesso"})
  } catch (error) {
    res.status(400).json({error: "Erro ao atualizar evento"})
  }
})

app.delete('/cadastroeventos', async (req, res) =>{
  try {
    const {id} = req.query;
    const eventoDeletado = await Evento.findByIdAndDelete(id);
    if(!eventoDeletado){
      return res.status(400).json({message: "Evento não encontrado"})
    }
    res.status(200).json({message: "Evento deletado com sucesso"})
  } catch (error) {
    res.status(400).json({error: "Erro ao deletar evento"})
  }
})

app.get('/cadastroeventos', async (req, res) =>{
  try {
    const eventos = await Evento.find();
    if(eventos.length == 0){
     return res.status(400).json({message: "Nenhum evento cadastrado"})
    }
    res.status(200).json(eventos)
  } catch (error) {
    res.status(400).json({error: "Erro ao encontrar eventos"})
  }
})

//------------------CADASTRO VACINAS-------ok
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

  app.put('/cadastrovacinas', async (req, res) =>{
    try {
      const {id} = req.query;
      const {codVacina, idUsuario, nome, duracao} = req.body;

      const vacinaAtualizada = await Vacina.findByIdAndUpdate(
        id,
        {codVacina, idUsuario, nome, duracao},
        {new: true}
      )
      if(!vacinaAtualizada){
        return res.status(400).json({message: "Vacina não encontrada"})
      }
      res.status(200).json({message: "Vacina atualizada com sucesso"})
    } catch (error) {
      res.status(400).json({error: "Erro ao atualizar vacina"})
    }
  })

  app.delete('/cadastrovacinas', async (req, res) =>{
    try {
      const {id} = req.query;
      const vacinaDeletada = await Vacina.findByIdAndDelete(id);
      
      if(!vacinaDeletada){
        res.status(400).json({message: "Vacina não encontrada"})
      }
      res.status(200).json({message: "Vacina deletada com sucesso"})
    } catch (error) {
      res.status(400).json({error: "Erro ao deletar vacina"})
    }
  })

  app.get('/cadastrovacinas', async (req, res) =>{
    try {
      const vacinas = await Vacina.find();
      if(vacinas.length == 0){
        res.status(400).json({message: "Nenhuma vacina cadastrada"})
      }
      res.status(200).json(vacinas)
    } catch (error) {
      res.status(400).json({error: "Erro ao encontrar vacinas"})
    }
    })

app.listen (port, ()=>{
    console.log(`servidor iniciado com sucesso na porta ${port}`);
});