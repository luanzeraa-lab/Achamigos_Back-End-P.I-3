const { json } = require('express');
const AnimalModel = require('../models/AnimalModel');



exports.cadastrarAnimal = async (req, res) =>{
  try {
      const animalCadastrado = await AnimalModel.cadastrarAnimal(req.body, req.file);
      return res.status(201).json(animalCadastrado)  
  } catch (error) {
    return res.status(400).json({error: error.message})
  }
}

exports.alterarAnimal = async (req, res) =>{
    try {
    const {id} = req.params;
    const dados = req.body
    const animalAlterado = await AnimalModel.alterarAnimal(id, dados);
   
    if (!animalAlterado) {
      return res.status(404).json({ error: "Animal não encontrado" });
    }
   
     res.status(200).json(animalAlterado)
     } catch (error) {
    return res.status(400).json({error: error.message})
  }
}

// exports.listarAnimal = async (req, res) =>{
//   try {
//     const animals = await Animal.find();
//     if(animals.length == 0){
//       res.status(400).json({message:"Nenhum animal cadastrado"})
//     }
//     res.status(200).json(animals)
//   } catch (error) {
//     res.status(400).json({error: error.message})
//   }
// }

//     const animalAtualizado = await Animal.findByIdAndUpdate(
//     id,
//     {nome, idade, raca, sexo, porte, peso, observacoes, castracao},
//     {new: true});
//      res.json(animalAtualizado);
//     } catch (error) {
//       res.status(400).json({error: "Erro ao atualizar"})
//      }
// }

// exports.deletarAnimal = async (req, res) =>{
//     try {
//         const {id} = req.query;
//         const animalDeletado = await Animal.findByIdAndDelete(id)
//         if (!animalDeletado){
//           return res.status(400).json({message: "Animal não encontrado"})
//         }
//         res.status(200).json({message: "Animal deletado com sucesso"})
//       } catch (error) {
//         res.status(400).json({error: "Erro ao deletar animal"})
//       }
// }

