import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { UsersDTO } from '../dto/UsersDTO.js';

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
        res.status(500).json({ error: 'GitHub login error', details: error });
    }
};

export const debugSession = (req, res) => {
    res.success('Session data', {
        session: req.session,
        user: req.user
    });
};

export class UsersController {
    async getUserByEmail(req, res) {
        const { email } = req.params;
        const user = await UserManager.getByEmail(email);
        const userDTO = new UsersDTO(user);
        res.json(userDTO);
    }
}
