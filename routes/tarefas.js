const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

let tarefasCollection;

// Inicializa a coleção do MongoDB
function initialize(db) {
    tarefasCollection = db.collection('tarefas');
}

// Rota para visualizar a lista de tarefas
router.get('/', async (req, res) => {
    try {
        const tarefas = await tarefasCollection.find().toArray();
        const data = new Date();
        res.render('tarefas', { tarefas, data });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rota para exibir o formulário de adicionar novo tarefa
router.get('/add', (req, res) => {
    res.render('adicionar_tarefa');
});

// Rota para criar uma nova tarefa
router.post('/add', async (req, res) => {
    const { tarefas, data } = req.body;
   
    try {
        await tarefasCollection.insertOne({ tarefas, data });
        res.redirect('/tarefas');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rota para exibir o formulário de edição de uma tarefa existente
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const tarefas = await tarefasCollection.findOne({ _id: new ObjectId(id) });
        res.render('editar_tarefa', { tarefas });
    } catch (err) { 
        res.status(500).send(err.message);
    }
});


// Rota para marcar uma tarefa como completa
router.post('/complete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Atualize o status da tarefa para completa
        await tarefasCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { concluida: true } } // Supondo que você tenha um campo `completa`
        );
        res.redirect('/tarefas');
    } catch (err) {
        res.status(500).send(err.message);
    }
});




// Rota para processar a atualização das tarefas
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { tarefas, data } = req.body;
    try {
        await tarefasCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { tarefas, data } }
        );
        res.redirect('/tarefas');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rota para deletar uma tarefa
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
       
        await tarefasCollection.deleteOne({ _id: new ObjectId(id) });
        res.redirect('/tarefas');
    } catch (err) {
        res.status(500).send(err.message);
    }
});


module.exports = { router, initialize };
