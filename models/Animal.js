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
module.exports = mongoose.model('Animal', AnimalSchema);