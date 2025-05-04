import CustomError from '../utils/customError.js';

// middleware de validación
export function validateProduct(req, res, next) {
    const { title, description, price } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return next(new CustomError('Invalid or missing title', 400));
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
        return next(new CustomError('Invalid or missing description', 400));
    }

    if (price === undefined || typeof price !== 'number' || price <= 0) {
        return next(new CustomError('Invalid or missing price', 400));
    }

    next();
}