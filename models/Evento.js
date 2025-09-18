const mongoose = require('mongoose');

const EventoSchema = new mongoose.Schema({
    ///PK
    idEvento : {type: Number},
    //FK
    idUsuario: {type: Number},
    
    data_Publicacao: {type: Date, default: Date.now },
    data_Exclusao :{type: Date, default: Date.now },
    tipo_Evento: {type: String},
    texto: {type: String},
    eventoStatus :{type: String},
    imagem: {type: String}
});
module.exports = mongoose.model('Evento', EventoSchema)
