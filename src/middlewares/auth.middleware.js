export const authorizationRol = (rol = "") => {
    return (req, res, next) => {

        if (!req.user) {
            res.setHeader();
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        if (rol.toLowerCase() === 'public' || role.length === 0) return next(); 

        if (req.user.role !== role) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(403).json({ error: 'Insufficient privileges to access this resource' });
        }

        next();
    };
};