const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    cnpj: {type: String, required: true},
    telefone: {type: String, required: true},
    userLogin: {type: String, required: true},
    senha: {type: String, required: true},
    email: {type: String, required: true},
    endereco: {type: String, required: true},
    tipo: {type: String, required: true},
    userStatus: {type: String, required: true}
});
module.exports = mongoose.model('User', UserSchema);