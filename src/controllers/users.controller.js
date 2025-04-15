import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const renderLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

export const renderRegisterForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

export const renderAdminProducts = (req, res) => {
    const user = req.user;
    res.render('products', { user });
};

export const githubCallback = (req, res) => {
    const user = req.user;
    try {
        const token = jwt.sign({ id: user._id }, config.jwt_secret, { expiresIn: '1h' });
        res.cookie('jwtToken', token, { httpOnly: true });
        res.redirect('/views/products/view');
    } catch (error) {
        res.internalError('GitHub login error:', error);
    }
};

export const debugSession = (req, res) => {
    res.success('Session data', {
        session: req.session,
        user: req.user
    });
};
