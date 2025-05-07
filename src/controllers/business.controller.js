import { BusinessModel } from '../models/Business.model.js';

export async function createBusiness(req, res) {

    try {
        console.log('BODY:', req.body);
        const { name, address, products } = req.body;
        const newBusiness = await BusinessModel.create({ name, address, products });
        res.success('Business created', newBusiness);
    } catch (error) {
        console.error('Error creating business:', error);
        res.internalError('Error creating business');
    }

}