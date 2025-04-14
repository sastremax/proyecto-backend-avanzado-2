import { handlePolicies } from '../middlewares/handlePolicies.js';
import CustomRouter from './CustomRouter.js';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import multerUpload from '../middlewares/multer.middleware.js';
import mongoose from 'mongoose';
import { attachUserFromToken } from '../middlewares/viewUser.middleware.js';

export default class ViewsRouter extends CustomRouter {

    init() {

        // vista de registro
        this.get('/register', (req, res) => {
            const { error, first_name, last_name, email, age } = req.query;
            res.render('register', { error, first_name, last_name, email, age });
        });

        // vista de logueo
        this.get('/login', (req, res) => {
            const { error, success } = req.query;
            res.render('login', { error, success });
        });

        // vista de productos
        this.get('/products/view', attachUserFromToken, handlePolicies(['USER', 'ADMIN']), async (req, res) => {
            try {
                const products = await Product.find();
                res.render('home', {
                    products,
                    user: req.user,
                    layout: "main"
                });
            } catch (error) {
                console.error("Error loading products view:", error);
                res.status(500).send("Error loading product list");
            }
        });

        // vista de un carrito
        this.get('/cart/:id', async (req, res) => {
            try {
                const cart = await Cart.findById(req.params.id).populate("products.product");

                if (!cart || !cart.products) {
                    return res.status(404).render("error", { message: "Cart not found" });
                }

                res.render("cart", { layout: "main", cart });
            } catch (error) {
                console.error("Error loading cart view:", error);
                res.status(500).send("Error loading cart page");
            }
        });

        // Vista para actualizar un producto desde el navegador
        this.post('/products/update/:id', async (req, res) => {
            try {
                if (mongoose.connection.readyState !== 1) {
                    throw new Error("Database connection lost");
                }

                const { id } = req.params;
                const updateFields = req.body;

                if (Object.keys(updateFields).length === 0) {
                    return res.status(400).send("No fields provided for update.");
                }

                const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });

                if (!updatedProduct) {
                    return res.status(404).send("Product not found.");
                }

                res.redirect(`/views/products/details/${id}?success=2`);
            } catch (error) {
                console.error("Error updating product:", error);
                res.status(500).send("Error updating product.");
            }
        });

        // Vista para eliminar un producto desde el navegador
        this.post('/products/delete/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const deletedProduct = await Product.findByIdAndDelete(id);

                if (!deletedProduct) {
                    return res.status(404).send("Product not found.");
                }

                res.redirect("/views/products/view");
            } catch (error) {
                console.error("Error deleting product:", error);
                res.status(500).send("Error deleting product.");
            }
        });

        // Subir imagenes desde el navegador
        this.post('/products/:id/upload', multerUpload.single('image'), async (req, res) => {
            try {
                const { id } = req.params;
                if (!req.file) {
                    return res.status(400).send("No image uploaded.");
                }

                const imagePath = `/img/${req.file.filename}`;
                const product = await Product.findById(id);

                if (!product) {
                    return res.status(404).send("Product not found.");
                }

                if (!Array.isArray(product.thumbnails)) {
                    product.thumbnails = [];
                }

                product.thumbnails.push(imagePath);
                await product.save();

                res.redirect(`/views/products/details/${id}?success=1`);
            } catch (error) {
                console.error("Error uploading product image:", error);
                res.status(500).send("Error uploading image.");
            }
        });
    }

}