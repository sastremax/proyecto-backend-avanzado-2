// middleware de validación

export function validateProduct(req, res, next) {
    const { title, description, price } = req.body;

    if (!title || !description || !price) {
        return res.badRequest('Campos obligatorios faltantes');
    }

    next();
}