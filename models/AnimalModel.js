const mongoose = require('mongoose');

const AnimalSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    idade: {type: String},
    raca: {type: String, required: true},
    sexo: {type: String, required: true},
    porte: {type: String, required:true},
    peso: {type: String}, 
    observacoes: {type: String},
    castracao: {type: Boolean, required:true},
    imagem: {type: String}
});

const Animal = mongoose.model("Animal", AnimalSchema)

const cadastrarAnimal = async (dados, file) => {
  const novoAnimal = new Animal({
    ...dados,
    imagem: file? `/public/${file.filename}` : null
  });
  return await novoAnimal.save();
};

const alterarAnimal = async (id, dados) => {
   return await Animal.findByIdAndUpdate(
    id,
    dados,
  {new: true});
}
module.exports = {Animal, cadastrarAnimal, alterarAnimal};




