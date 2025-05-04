import ProductModel from '../models/Product.model.js';
import CustomError from '../utils/customError.js';
import mongoose from 'mongoose';

// GET /api/products
export async function getProducts(req, res, next) {
    try {
        const products = await ProductModel.find();
        res.success('Products retrieved', products);
    } catch (error) {
        console.error('Error getting products:', error);
        next(new CustomError('Error getting products', 500));
    }
}

// GET /api/products/:id
export async function getProductById(req, res, next) {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new CustomError('Invalid product ID format', 400));
        }

        const product = await ProductModel.findById(id);

        if (!product) {
            return next(new CustomError('Product not found', 404));
        }
        res.success('Product retrieved', product);

    } catch (error) {
        console.error('Error getting product by ID:', error);
        next(new CustomError('Error getting product', 500));
    }
}

// POST /api/products
export async function addProduct(req, res, next) {
    try {
        const newProduct = await ProductModel.create(req.body);
        res.created('Product created successfully', newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        next(new CustomError('Error creating product', 500));
    }
}

// PUT /api/products/:id
export async function updateProduct(req, res, next) {
    try {
        const updated = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return next(new CustomError('Product not found', 400));
        }
        res.success('Product updated', updated);
    } catch (error) {
        console.error('Error updating product:', error);
        next(new CustomError('Error updating product', 500));
    }
}

// DELETE /api/products/:id
export async function deleteProduct(req, res, next) {
    try {
        const deleted = await ProductModel.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return next(new CustomError('Product not found', 400)); // Usamos CustomError si el producto no se encuentra
        }

        res.success('Product deleted', deleted);
    } catch (error) {
        console.error('Error deleting product:', error);
        next(new CustomError('Error deleting product', 500));
    }
}