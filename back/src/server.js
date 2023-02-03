import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import database from './database/db';
import apiRoutes from './routes/api';
import authRoutes from './routes/auth';
import PartyController from './controllers/PartyController';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.get('/', (req, res) => {
    res.send({ message: 'Você está na rota raiz'});
})

// Rotas com middleware
app.use('/api', apiRoutes);

// Rotas públicas
app.use('/api/auth', authRoutes)
app.get('/api/party/all', PartyController.getAllParty)
app.get('/api/party/:id', PartyController.getParty)

// Iniciando a aplicação
database.connect()
    .then(() => {
        app.listen(process.env.PORT_APP, () => {
            console.log(`Server started on port ${process.env.PORT_APP}`);
        })
    })
    .catch((err) => {
        console.log(err);
    })