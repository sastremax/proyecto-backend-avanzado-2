import OrderModel from '../models/Order.model.js';

export async function createOrder(req, res) {

    try {
        const { business, user, products, totalAmount } = req.body;
        if (!business || !user || !products || !totalAmount) {
            return res.badRequest('Missing required fields');
        }

        const newOrder = await OrderModel.create({
            business,
            user,
            products,
            totalAmount
        });

        res.success('Order created successfully', newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.internalError('Error creating order');
    }

}

export async function getAllOrders(req, res) {

    try {
        const orders = await OrderModel.find().populate('user').populate('business').populate('products.product');
        res.success('Orders retrieved', orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.internalError('Error retrieving orders');
    }

}