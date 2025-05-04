import CustomRouter from './CustomRouter.js';
import passport from 'passport';
import {
    githubCallback,
    debugSession,
    getUserByEmail
} from '../controllers/users.controller.js';

export default class UsersRouter extends CustomRouter {
    init() {
        
        // inicio del login con GitHub
        this.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

        // callback de GitHub luego de autenticar
        this.get('/githubcallback',
            passport.authenticate('github', {
                session: false
            }),
            githubCallback
        );

        this.get('/:email', getUserByEmail);

        // debug
        this.get('/debug/session', debugSession);
    }
}