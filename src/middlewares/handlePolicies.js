import jwt from 'jsonwebtoken';

export function handlePolicies(policies = []) {
    return async (req, res, next) => {
        try {
            // acceso publico sin autorizacion
            if (policies.includes('PUBLIC')) return next();

            let token;

            // 1. intento obtener token desde el header
            const authHeader = req.headers.authorization;
            if (authHeader?.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }

            // 2. si no está en el header, intento desde la cookie
            if (!token && req.cookies?.jwtToken) {
                token = req.cookies.jwtToken;
            }
            if (!token) return res.unauthorized('Token missing or malformed');
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // rol del usuario dentro de las politicas
            if (!policies.includes(decoded.role.toUpperCase())) {
                return res.forbidden('Access denied for your role');
            }

            next();
        } catch (error) {
            console.error('handlePolicies error:', error);
            res.internalError('Authorization failed');
        }
    };
}