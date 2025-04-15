import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const loginSession = (req, res, next) => {
    try {
        const user = req.user;

        const token = jwt.sign({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            cart: user.cart
        }, config.jwt_secret, { expiresIn: '1h' });

        res.cookie('jwtToken', token, { httpOnly: true });
        res.redirect('/views/products/view');
    } catch (error) {
        next(error);
    }
};

export const registerSession = (req, res) => {
    const user = req.user;

    if (!user) {
        const info = req.authInfo || {};
        const errorMessage = encodeURIComponent(info.message || 'Registration failed');
        const redirectUrl = `/views/register?error=${errorMessage}&first_name=${req.body.first_name}&last_name=${req.body.last_name}&email=${req.body.email}&age=${req.body.age}`;
        return res.redirect(redirectUrl);
    }

    res.redirect('/views/login?success=User+registered+successfully,+please+log+in');
};

export const currentSession = (req, res) => {
    res.success('Current user', req.user);
};

export const logoutSession = (req, res) => {
    res.clearCookie('jwtToken');
    res.success('Logout successful');
};
