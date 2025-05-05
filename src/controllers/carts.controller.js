import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import TicketModel from '../models/Ticket.model.js';
import mongoose from 'mongoose';

export async function seedCarts(req, res) {
    try {
        const products = await Product.find();
        if (products.length < 5) {
            return res.badRequest('Not enough products to create carts');
        }

        const carts = [
            {
                products: [
                    { product: products[0]._id, quantity: 2 },
                    { product: products[1]._id, quantity: 1 }
                ]
            },
            {
                products: [
                    { product: products[2]._id, quantity: 3 },
                    { product: products[3]._id, quantity: 1 }
                ]
            },
            {
                products: [
                    { product: products[4]._id, quantity: 5 }
                ]
            }
        ];

        await Cart.insertMany(carts);
        res.created('Sample carts added successfully');
    } catch (error) {
        console.error('Error inserting sample carts:', error);
        res.internalError('Error inserting sample carts');
    }
}

export async function getCartById(req, res) {
    try {
        const cart = await Cart.findById(req.params.id).populate({
            path: 'products.product',
            select: 'title price description stock category thumbnails'
        });

        if (!cart) return res.notFound('Cart not found');
        res.success('Cart founded', cart);
    } catch (error) {
        console.log('Error getting cart by id:', error);
        res.internalError('Error getting cart by id');
    }
}

export async function createCart(req, res) {
    try {
        const newCart = await Cart.create({ products: [] });
        res.created('Cart created successfully', newCart);
    } catch (error) {
        console.log('Error creating cart:', error);
        res.internalError('Error creating cart');
    }
}

export async function addProductToCart(req, res) {
    try {
        const { cid, pid } = req.params;
        const quantity = Number.parseInt(req.body.quantity) > 0 ? Number.parseInt(req.body.quantity) : 1;

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.badRequest('Invalid cart ID format');
        }

        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.badRequest('Invalid product ID format');
        }

        const cart = await Cart.findById(cid);
        if (!cart) return res.notFound('Cart not found');

        const productExists = await Product.findById(pid);
        if (!productExists) return res.notFound('Product not found');

        const existingProduct = cart.products.find(p => p.product.toString() === pid);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        res.success('Product added successfully', cart);
    } catch (error) {
        console.log('Error adding product to cart:', error);
        res.internalError('Error adding product to cart');
    }
}

export async function removeProductFromCart(req, res) {
    try {
        const { id, productId } = req.params;

        const cart = await Cart.findById(id);
        if (!cart) return res.notFound('Cart not found');

        const updatedProducts = cart.products.filter(p => p.product.toString() !== productId);
        if (updatedProducts.length === cart.products.length) {
            return res.notFound('Product not found in cart');
        }

        cart.products = updatedProducts;
        await cart.save();

        res.success('Product removed from cart', cart);
    } catch (error) {
        console.log('Error removing product from cart:', error);
        res.internalError('Error removing product from cart');
    }
}

export async function clearCart(req, res) {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) return res.notFound('Cart not found');

        cart.products = [];
        await cart.save();

        res.success('Cart cleared successfully', cart);
    } catch (error) {
        console.log('Error clearing cart:', error);
        res.internalError('Error clearing cart');
    }
}

export async function deleteCart(req, res) {
    try {
        const deletedCart = await Cart.findByIdAndDelete(req.params.id);
        if (!deletedCart) return res.notFound('Cart not found');

        res.success('Cart deleted successfully');
    } catch (error) {
        console.log('Error deleting cart:', error);
        res.internalError('Error deleting cart');
    }
}

export async function updateCart(req, res) {
    try {
        const { id } = req.params;
        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.badRequest('products must be a non-empty array');
        }

        const cart = await Cart.findById(id);
        if (!cart) return res.notFound('Cart not found');

        cart.products = products;
        await cart.save();

        res.success('Cart updated successfully', cart);
    } catch (error) {
        console.log('Error updating cart:', error);
        res.internalError('Error updating cart');
    }
}

export async function updateProductQuantity(req, res) {
    try {
        const { id, productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.badRequest('Invalid quantity');
        }

        const cart = await Cart.findById(id);
        if (!cart) return res.notFound('Cart not found');

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex === -1) {
            return res.notFound('Product not found in cart');
        }

        const product = await Product.findById(productId);
        if (!product) return res.notFound('Product not found in database');

        if (quantity > product.stock) {
            return res.conflict(`Not enough stock available, only ${product.stock} left`);
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();

        res.success('Product quantity updated', cart);
    } catch (error) {
        console.log('Error updating product quantity:', error);
        res.internalError('Error updating product quantity');
    }
}

export async function purchaseCart(req, res) {
    
    try {
        const cartId = req.params.id;

        const cart = await Cart.findById(cartId).populate({
            path: 'products.product',
            select: 'title price stock'
        });

        if (!cart) {
            return res.notFound('Cart not found');
        }

        let totalAmount = 0;
        const productsNotPurchased = [];
        const productsPurchased = [];

        for (const item of cart.products) {
            const { product, quantity }  = item;

            if (!product?._id || product.stock < quantity) {
                productsNotPurchased.push(item);
                continue;
            }

            totalAmount += product.price * quantity;
            product.stock -= quantity;
            await product.save();
            productsPurchased.push(product._id.toString());
        }

        const ticket = await TicketModel.create({
            code: Date.now().toString(),
            amount: totalAmount,
            purchaser: req.user.email
        });

        cart.products = cart.products.filter(item => {
            const id = item.product?._id?.toString();
            return !productsPurchased.includes(id);
        });

        await cart.save();
        
        res.success('Purchase completed', {
            ticket,
            productsNotPurchased
        });

    } catch (error) {
        console.error('Error in purchaseCart:', error);
        res.internalError('Error processing cart purchase');
    }

}
