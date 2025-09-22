
const FiltroService = require('../services/FiltroService')

exports.filtrarAnimais = async (req, res) =>{
    try {
        const {cidade} = req.params;
        const animaisFiltrados = await FiltroService.filtrarAnimaisPorCidade(cidade);
        if(!animaisFiltrados){
            return res.status(404).json({ error: "Animal não encontrado" });
        }
        return res.status(200).json(animaisFiltrados)
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}