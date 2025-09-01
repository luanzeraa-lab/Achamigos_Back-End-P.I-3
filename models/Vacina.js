const mongoose = require('mongoose');

const VacinaSchema = new mongoose.Schema({
    //PK
    codVacina: {type: Number, required: true},
    //FK
    idUsuario: {type: Number, required: true},
    nome: {type: String, required: true},
    duracao: {type: String}
});
module.exports = mongoose.model('Vacina', VacinaSchema);