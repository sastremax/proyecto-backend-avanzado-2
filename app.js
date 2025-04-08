import express from 'express';
import { connectToDB } from './src/config/db.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './src/routes/user.router.js';
import { engine } from 'express-handlebars';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import session from 'express-session'; 
import passport from 'passport';   
import initializePassport from './src/config/passport.config.js';
import sessionRouter from './src/routes/session.router.js';
import BaseRouter from './src/routes/base.router.js';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 8084

// configuro handlebars como motor de plantillas
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}))
app.set('view engine', 'handlebars')
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('views', path.join(__dirname, 'src', 'views'))
app.use(express.static(path.join(__dirname, 'src', 'public')));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// lectura de cookies
app.use(cookieParser());

// rutas
app.use(session({
    secret: process.env.SECRET_KEY, 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session())


app.use('/api/users', userRouter);
app.use('/api/sessions', sessionRouter);
app.use('/base', new BaseRouter().getRouter());

// servidor
const startServer = async () => {
    await connectToDB()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

startServer();