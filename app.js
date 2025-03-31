import express from 'express';
import { connectToDB } from './src/config/db.js';
import dotenv from 'dotenv';
import userRouter from './src/routes/user.router.js';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 8084

// configuro handlebars como motor de plantillas
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
const __filename = fileURLToPath(import.meta.url) // obtengo la ruta del archivo actual
const __dirname = path.dirname(__filename) // simulo __dirname como en CommonJS

app.set('views', path.join(__dirname, 'src', 'views'))

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rutas
app.use('/api/users', userRouter);

// servidor
const startServer = async () => {
    await connectToDB()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

startServer();