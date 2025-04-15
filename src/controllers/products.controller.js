import ProductModel from '../models/Product.model.js';

// GET /api/products
export async function getProducts(req, res) {
    try {
        const products = await ProductModel.find();
        res.success('Products retrieved', products);
    } catch (error) {
        console.error('Error getting products:', error);
        res.internalError('Error getting products');
    }
}

// GET /api/products/:id
export async function getProductById(req, res) {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) return res.badRequest('Product not found');
        res.success('Product retrieved', product);
    } catch (error) {
        console.error('Error getting product by ID:', error);
        res.internalError('Error getting product');
    }
}

// POST /api/products
export async function addProduct(req, res) {
    try {
        const newProduct = await ProductModel.create(req.body);
        res.created('Product created successfully', newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.internalError('Error creating product');
    }
}

// PUT /api/products/:id
export async function updateProduct(req, res) {
    try {
        const updated = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.badRequest('Product not found');
        res.success('Product updated', updated);
    } catch (error) {
        console.error('Error updating product:', error);
        res.internalError('Error updating product');
    }
}

// DELETE /api/products/:id
export async function deleteProduct(req, res) {
    try {
        const deleted = await ProductModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.badRequest('Product not found');
        res.success('Product deleted', deleted);
    } catch (error) {
        console.error('Error deleting product:', error);
        res.internalError('Error deleting product');
    }
}