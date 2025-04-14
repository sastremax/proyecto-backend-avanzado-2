import CustomRouter from './CustomRouter.js';
import { handlePolicies } from '../middlewares/handlePolicies.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export default class UsersRouter extends CustomRouter {
    init() {
        // renderizo el formulario de login
        this.get('/login/form', (req, res) => {
            res.render('login', { title: 'Login' })
        });

        // renderizo el formulario de registro
        this.get('/register', (req, res) => {
            res.render('register', { title: 'Register' })
        });

        // productos solo para admin
        this.get('/products',
            handlePolicies(['ADMIN']),
            (req, res) => {
                const user = req.user
                res.render('products', { user });
            }
        );

        // inicio del login con GitHub
        this.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

        // callback de GitHub luego de autenticar
        this.get('/githubcallback',
            passport.authenticate('github', {
                failureRedirect: '/api/users/login/form', 
                session: false
            }),
            (req, res) => {
                const user = req.user;
                try {
                    const token = jwt.sign({ id: user._id }, config.jwt_secret, { expiresIn: '1h' });
                    res.cookie('jwtToken', token, { httpOnly: true });
                    res.redirect('/views/products/view');
                } catch (error) {
                    res.internalError('GitHub login error');
                }
            }
        );

        // debug
        this.get('/debug/session', (req, res) => {
            res.success('Session data', {
                session: req.session,
                user: req.user
            });
        });
    }
}