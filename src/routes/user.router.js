import { Router } from 'express';
import { authorizeAdmin } from '../middlewares/auth.middleware.js';
import passport from 'passport'

const router = Router();

// renderizo el formulario de login
router.get('/login/form', (req, res) => {
    res.render('login', { title: 'Login' }) // renderizo la vista login.handlebars
})

// renderizo el formulario de registro
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' }) // renderizo la vista register.handlebars
})

router.get('/products', authorizeAdmin, (req, res) => {
    const { name, role } = req.query // obtengo los datos desde los parámetros de la URL
    const user = { first_name: name, role } // armo un objeto user con esos datos
    res.render('products', { user }) // renderizo la vista de productos con los datos del usuario
})

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/api/users/register', // si falla, vuelve al form
    successRedirect: '/api/users/login/form' // si registra bien, va al login
}))

router.post('/login', passport.authenticate('login', {
    failureRedirect: '/api/users/login/form', // si falla, vuelve al form
}), (req, res) => {
    const user = req.user // obtengo el usuario desde la sesión
    res.redirect(`/api/users/products?name=${user.first_name}&role=${user.role}`)
})

// inicio del login con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

// callback de GitHub luego de autenticar
router.get('/githubcallback', passport.authenticate('github', {
    failureRedirect: '/api/users/login/form' // si falla vuelve al formulario
}), (req, res) => {
    const user = req.user // obtengo el usuario de la sesión
    res.redirect(`/api/users/products?name=${user.first_name}&role=${user.role}`) // redirijo igual que en login local
})

router.get('/ping', (req, res) => {
    res.send('Pong! Server is working!')
});

export default router;