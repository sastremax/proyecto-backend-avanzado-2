import CustomRouter from './CustomRouter.js';
import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getHomeView,
    getProductDetailsView,
    updateProductView,
    deleteProductView,
    seedProducts
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

        // vistas
        this.get('/view/home', getHomeView);
        this.get('/view/:id', getProductDetailsView);
        this.put('/view/:id', updateProductView);
        this.delete('/view/:id', deleteProductView);

        // carga de archivos
        this.post('/api/seed', seedProducts);
        this.post('/api/products/:id/upload', multerUpload.single('image'), (req, res) => {
            res.success('Imagen subida correctamente', { filename: req.file.filename });

        });

    }

}