const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const tarefasRoutes = require('./routes/tarefas');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Servindo arquivos estáticos
app.use(express.static('public'));

const url = 'mongodb://localhost:27017';
const dbName = 'tarefasDB';

MongoClient.connect(url, { useUnifiedTopology: true })
    .then(client => {
        console.log('Conectado ao MongoDB');
        const db = client.db(dbName);

        // Inicializando a coleção de clientes nas rotas
        tarefasRoutes.initialize(db);

        // Usando as rotas de clientes
        app.use('/tarefas', tarefasRoutes.router);
    })
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});