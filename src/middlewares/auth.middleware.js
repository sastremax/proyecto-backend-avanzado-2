export const authorizeAdmin = (req, res, next) => {
    const user = req.user

    if (!user || user.role !== 'admin') {
        return res.status(403).send('access denied')
    }
    next()
};