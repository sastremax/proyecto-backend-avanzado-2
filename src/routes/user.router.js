import { Router } from 'express';
import { authorizationRole } from '../middlewares/auth.middleware.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

// renderizo el formulario de login
router.get('/login/form', (req, res) => {
    try {
        res.render('login', { title: 'Login' }) // renderizo la vista login.handlebars
    } catch (error) {
        console.error('Login form render error:', error);
        res.status(500).send('Error rendering login form');
    }
});

// renderizo el formulario de registro
router.get('/register', (req, res) => {
    try {
        res.render('register', { title: 'Register' }) // renderizo la vista register.handlebars
    } catch (error) {
        console.error('Register form render error:', error);
        res.status(500).send('Error rendering register form');
    }
});

router.get('/products',
    passport.authenticate('current', { session: false }),
    authorizationRole('admin'),
    (req, res) => {
        try {
            const user = req.user // uso el usuario autenticado
            console.log(req.user)
            res.render('products', { user }); // renderizo la vista de produc0tos con los datos del usuario
        } catch (error) {
            console.error('Products render error:', error);
            res.status(500).send('Error rendering products');
        }
    }
);

// inicio del login con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// callback de GitHub luego de autenticar
router.get('/githubcallback', passport.authenticate('github', {
    failureRedirect: '/api/users/login/form', // si falla vuelve al formulario
    session: false
}), (req, res) => {
    try {
        const user = req.user;
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('jwtToken', token, { httpOnly: true });
        res.redirect('/api/users/products?from=github');
    } catch (error) {
        console.error('GitHub login error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// debug
router.get('/debug/session', (req, res) => {
    try {
        res.json({
            session: req.session,
            user: req.user
        });
    } catch (error) {
        console.error('Debug session error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;