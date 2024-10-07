const mongoose = require('mongoose');

const TarefaSchema = new mongoose.Schema({
    tarefas: { type: String, required: true },
    data: { type: Date, required: true },
    concluida: { type: Boolean,/**/ default: false }
});

// required: true,
module.exports = mongoose.model('Tarefa', TarefaSchema);