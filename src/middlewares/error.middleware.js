import CustomError from '../utils/customError.js';

// middleware de validación
export function validateProduct(req, res, next) {
    const { title, description, price } = req.body;

    if (!title || !description || !price) {
        return next(new CustomError('fields are not complete', 400));
    }

    next();
}