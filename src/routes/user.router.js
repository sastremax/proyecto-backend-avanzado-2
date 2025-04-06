import { Router } from 'express';
import { authorizeAdmin } from '../middlewares/auth.middleware.js';
import passport from 'passport';
import { auth } from '../middlewares/auth.js';

const router = Router();

// renderizo el formulario de login
router.get('/login/form', (req, res) => {
    res.render('login', { title: 'Login' }) // renderizo la vista login.handlebars
});

// renderizo el formulario de registro
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' }) // renderizo la vista register.handlebars
});

router.get('/products', 
    passport.authenticate('current', { session: false }),
    auth,
    authorizeAdmin,
    (req, res) => {
        const user = req.user // uso el usuario autenticado
        console.log(req.user)
        res.render('products', { user }); // renderizo la vista de productos con los datos del usuario
    }
);

// inicio del login con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

// callback de GitHub luego de autenticar
router.get('/githubcallback', passport.authenticate('github', {
    failureRedirect: '/api/users/login/form' // si falla vuelve al formulario
}), (req, res) => {    
    res.redirect(`/api/users/products`);
});

// test de ping
router.get('/ping', (req, res) => {
    res.send('Pong! Server is working!')
});

// debug
router.get('/debug/session', (req, res) => {
    res.json({
        session: req.session,
        user: req.user
    });
});

export default router;