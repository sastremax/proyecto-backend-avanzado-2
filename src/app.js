import express from 'express';
import { connectToDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import SessionsRouter from './routes/sessions.router.js';
import BaseRouter from './routes/base.router.js';
import UsersRouter from './routes/users.router.js';
import ProductsRouter from './routes/products.router.js';
import CartsRouter from './routes/carts.router.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import config from './config/config.js';
import customResponses from './middlewares/customResponses.middleware.js';

const app = express()
const PORT = config.port;

// middlewares
app.use(express.json());
app.use(customResponses);
app.use(express.urlencoded({ extended: true }));

// lectura de cookies
app.use(cookieParser());

// rutas
app.use(session({
    secret: config.secret_key,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session())

app.use('/api/users', new UsersRouter().getRouter());
app.use('/api/sessions', new SessionsRouter().getRouter());
app.use('/api/products', new ProductsRouter().getRouter());
app.use('/api/carts', new CartsRouter().getRouter());
app.use('/base', new BaseRouter().getRouter());

app.use(errorHandler);
// servidor
const startServer = async () => {
    await connectToDB()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

startServer();