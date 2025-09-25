
const UserModel = require ('../models/UserModel')

exports.cadastrarUser = async(req, res) => {
    try {
        const newUser = await UserModel.cadastrarUser(req.body);
        console.log(newUser)
        res.status(200).json(newUser);

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

exports.alterarUser = async(req, res) => {
    try {
        const {id} = req.params;
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
}

exports.excluirUser = async(req, res) =>{
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
}