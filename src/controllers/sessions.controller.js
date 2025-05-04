import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import CartModel from '../models/Cart.model.js';
import { UserModel } from '../models/User.model.js';
import { UsersDTO } from '../dto/UsersDTO.js';
import { UserService } from '../services/UserService.js';

const userService = new UserService();

export const loginSession = (req, res, next) => {
    try {
        const dtoUser = userService.formatUser(req.user);

        const token = jwt.sign(dtoUser, config.jwt_secret, { expiresIn: '1h' });

        res.cookie('jwtToken', token, { httpOnly: true });
        res.success('Login successful', { token, user: dtoUser });
    } catch (error) {
        console.error('Error during login session:', error);
        next(error);
    }
};

export const registerSession = async (req, res, next) => {

    try {
        const user = req.user;

        if (!user) {
            return res.badRequest('User registration failed');
        }

        const newCart = await CartModel.create({ products: [] });
        await UserModel.findByIdAndUpdate(user._id, { cart: newCart._id });

        res.created('User registered successfully');

    } catch (error) {
        console.error('Error during registration session:', error);
        next(error);
    }

};

export const currentSession = (req, res) => {
    const dtoUser = new UsersDTO(req.user);
    res.success('Current user', dtoUser);
};

export const logoutSession = (req, res) => {
    res.clearCookie('jwtToken');
    res.success('Logout successful');
};
