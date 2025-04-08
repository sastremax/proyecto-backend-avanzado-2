import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authorizationRole } from '../middlewares/auth.middleware.js';

dotenv.config();

const router = Router();

// login con passport y generación de JWT
router.post('/login', (req, res, next) => {
    try {
        passport.authenticate('login', { session: false }, (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({ error: info?.message || 'Login failed' })
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.cookie('jwtToken', token, { httpOnly: true });

            res.status(200).json({
                status: 'success',
                message: 'Login successful',
                user: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role
                }
            });
        })(req, res, next);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// registro
router.post('/register', (req, res, next) => {
    try {
        passport.authenticate('register', { session: false }, (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(400).json({ error: info?.message });

            res.status(201).json({ message: 'User registered successfully' });
        })(req, res, next);
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// current
router.get('/current', passport.authenticate('current', { session: false }),
    authorizationRole(),
    (req, res) => {
        try {
            res.status(200).json({
                status: 'success',
                user: req.user
            });
        } catch (error) {
            console.error('Current error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

// logout
router.get('/logout', (req, res) => {
    try {
        res.clearCookie('jwtToken');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;