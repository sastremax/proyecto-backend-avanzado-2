import CustomRouter from './CustomRouter.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authorizationRole } from '../middlewares/auth.middleware.js';

dotenv.config();

export default class SessionsRouter extends CustomRouter {
    init() {
        // login con passport y generación de JWT
        this.post('/login', (req, res, next) => {
            passport.authenticate('login', { session: false }, (err, user, info) => {
                if (err) return next(err);
                if (!user) return res.unauthorized(info?.message || 'Login failed');
            
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.cookie('jwtToken', token, { httpOnly: true });

                res.success('Login successful', {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role
                });
            })(req, res, next);
        });

        // registro con passport
        this.post('/register', (req, res, next) => {
            passport.authenticate('register', { session: false }, (err, user, info) => {
                if (err) return next(err);
                if (!user) return res.badRequest(info?.message);

                res.created('User registered successfully');
            })(req, res, next);
        });

        // current
        this.get('/current',
            passport.authenticate('current', { session: false }),
            authorizationRole(),
            (req, res) => {
                res.success('Current user', req.user);
            }
        );

        // logout
        this.get('/logout', (req, res) => {
            res.clearCookie('jwtToken');
            res.success('Logout successful');
        });
    }
}