import CustomRouter from './CustomRouter.js';
import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/products.controller.js';
import { addTimestamp } from '../middlewares/logger.middleware.js';
import { validateProduct } from '../middlewares/error.middleware.js';
import multerUpload from '../middlewares/multer.middleware.js';
import passportCall from '../middlewares/passportCall.middleware.js';
import { authorizationRole } from '../middlewares/auth.middleware.js';

export default class ProductsRouter extends CustomRouter {

    init() {

        // API REST
        this.get('/', addTimestamp, getProducts);
        this.get('/:id', addTimestamp, getProductById);
        this.post('/', passportCall('current'), authorizationRole('admin'), validateProduct, addProduct);
        this.put('/:id', passportCall('current'), authorizationRole('admin'), updateProduct);
        this.delete('/:id', passportCall('current'), authorizationRole('admin'), deleteProduct);

    }

}