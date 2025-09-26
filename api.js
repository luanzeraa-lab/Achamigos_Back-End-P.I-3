require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')
const multer = require("multer");
const fs = require("fs");
const { ppid } = require('process');

console.log("MONGO_URI =", process.env.MONGO_URI);

const animalRoute = require('./routes/AnimalRoute');
const userRoute = require('./routes/UserRoute');
const filtroRoute = require('./routes/FiltroRoute');
const eventoRoute = require('./routes/EventoRoute')

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use('/public', express.static(`${__dirname}/public`));

app.use(animalRoute);
app.use(userRoute);
app.use(eventoRoute);
app.use('/filtros', filtroRoute);

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
    
//--------------LOGIN----------

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

    // app.post('/login', async(req, res) =>{
    //   try {
    //     const {email, senha} = req.body;
    //     const usuario = await User.findOne({email, senha});
    //     if(!usuario){
    //       return res.status(400).json({message: "Dados do usuario incorretos"})
    //     }
    //     res.status(200).json({message: "Login realizado com sucesso"})
    //   } catch (error) {
    //     res.status(500).json({error: "Erro ao realizar login"})
    //   }
    // });
    
app.listen (port, ()=>{
    console.log(`servidor iniciado com sucesso na porta ${port}`);
});