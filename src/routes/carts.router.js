import CustomRouter from './CustomRouter.js';
import {
    getCartById,
    seedCarts,
    createCart,
    addProductToCart,
    clearCart,
    updateCart,
    updateProductQuantity,
    removeProductFromCart,
    deleteCart,
    purchaseCart
} from '../controllers/carts.controller.js';

import { addTimestamp } from '../middlewares/logger.middleware.js';

export default class CartsRouter extends CustomRouter {
    init() {
        // logger a nivel de router
        this.router.use(addTimestamp);

        // rutas de carrito
        this.get('/:id', getCartById);
        this.post('/seed', seedCarts);
        this.post('/', createCart);
        this.post('/:id/products/:productId', addProductToCart);
        this.post('/:id/purchase', purchaseCart);
        this.put('/:id', clearCart);
        this.put('/:id/products', updateCart);
        this.put('/:id/products/:productId', updateProductQuantity);
        this.delete('/:id/products/:productId', removeProductFromCart);
        this.delete('/:id', deleteCart);
    }
}
