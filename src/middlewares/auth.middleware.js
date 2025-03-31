export const authorizeAdmin = (req, res, next) => {
    const { role } = req.query

    if (role !== 'admin') {
        return res.status(403).send('access denied')
    }
    next()
}