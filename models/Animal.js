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

AnimalSchema.statics.cadastrarAnimal = async  (dados, file) => {
  const novoAnimal = new this({
    ...dados,
    imagem: file ? `/public/${file.filename}` : null
  });
  return await novoAnimal.save();
};

AnimalSchema.methods.resumo = function () {
  return `${this.nome} (${this.raca}) - Porte: ${this.porte}`;
};

const Animal = mongoose.model("Animal", AnimalSchema);
module.exports = Animal;

