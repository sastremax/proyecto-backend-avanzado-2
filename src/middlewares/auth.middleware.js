export const authorizationRole = (role = "") => {
    return (req, res, next) => {

        try {
            if (!req.user) {
                res.setHeader();
                return res.status(401).json({ error: 'Unauthorized access' });
            }

            if (role.toLowerCase() === 'public' || role.length === 0) return next();

            if (req.user.role !== role) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(403).json({ error: 'Insufficient privileges to access this resource' });
            }

            next();
        } catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};