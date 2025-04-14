import jwt from 'jsonwebtoken';

export function attachUserFromToken(req, res, next) {

    try {
        const token = req.cookies.jwtToken;
        if (!token) return next();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        next();
    }

}