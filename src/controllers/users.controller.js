import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { UsersDTO } from '../dto/UsersDTO.js';
import { UserManager } from '../dao/mongo/UserManager.js';

export const githubCallback = (req, res) => {
    const user = req.user;
    try {
        const token = jwt.sign({ id: user._id }, config.jwt_secret, { expiresIn: '1h' });
        res.cookie('jwtToken', token, { httpOnly: true });
        res.success('GitHub login successful', { token });
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

export const getUserByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await UserManager.getByEmail(email);
        if (!user) return res.notFound('User not found');
        const userDTO = new UsersDTO(user);
        res.success('User found', userDTO);
    } catch (error) {
        console.error('Error getting user by email:', error);
        res.internalError('Error getting user by email');
    }
};
