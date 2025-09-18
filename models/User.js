const mongoose = require('mongoose');

const EnderecoSchema = new mongoose.Schema({
    cep: {type: String, required: true},
    rua:{type: String, required: true},
    cidade: {type: String, required: true},
    numero: {type: String, required: true}
})

const UserSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    cnpj: {type: String, required: true},
    telefone: {type: String, required: true},
    userLogin: {type: String, required: true},
    senha: {type: String, required: true},
    email: {type: String, required: true},
    endereco: EnderecoSchema,
    tipo: {type: String, required: true},
    userStatus: {type: String, required: true},
    linkUser: {type: String}
});
module.exports = mongoose.model('User', UserSchema);