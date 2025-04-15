import CustomRouter from './CustomRouter.js';
import { handlePolicies } from '../middlewares/handlePolicies.js';
import passport from 'passport';
import {
    renderLoginForm,
    renderRegisterForm,
    renderAdminProducts,
    githubCallback,
    debugSession
} from '../controllers/users.controller.js';

export default class UsersRouter extends CustomRouter {
    init() {
        // renderizo el formulario de login
        this.get('/login/form', renderLoginForm);

        // renderizo el formulario de registro
        this.get('/register', renderRegisterForm);

        // productos solo para admin
        this.get('/products', handlePolicies(['ADMIN']), renderAdminProducts);            

        // inicio del login con GitHub
        this.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

        // callback de GitHub luego de autenticar
        this.get('/githubcallback',
            passport.authenticate('github', {
                failureRedirect: '/api/users/login/form', 
                session: false
            }),
            githubCallback
        );

        // debug
        this.get('/debug/session', debugSession);
    }
}