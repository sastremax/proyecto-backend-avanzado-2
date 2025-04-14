import ProductModel from '../models/Product.model.js';

// GET /api/products
export async function getProducts(req, res) {
    try {
        const products = await ProductModel.find();
        res.success('Productos encontrados', products);
    } catch (error) {
        res.internalError('Error al obtener productos');
    }
}

// GET /api/products/:id
export async function getProductById(req, res) {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) return res.badRequest('Producto no encontrado');
        res.success('Producto encontrado', product);
    } catch (error) {
        res.internalError('Error al obtener el producto');
    }
}

// POST /api/products
export async function addProduct(req, res) {
    try {
        const newProduct = await ProductModel.create(req.body);
        res.created('Producto creado correctamente', newProduct);
    } catch (error) {
        res.internalError('Error al crear el producto');
    }
}

// PUT /api/products/:id
export async function updateProduct(req, res) {
    try {
        const updated = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.badRequest('Producto no encontrado');
        res.success('Producto actualizado', updated);
    } catch (error) {
        res.internalError('Error al actualizar el producto');
    }
}

// DELETE /api/products/:id
export async function deleteProduct(req, res) {
    try {
        const deleted = await ProductModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.badRequest('Producto no encontrado');
        res.success('Producto eliminado', deleted);
    } catch (error) {
        res.internalError('Error al eliminar el producto');
    }
}

// GET /api/products/view/home
export async function getHomeView(req, res) {
    try {
        const products = await ProductModel.find();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Error al cargar la vista');
    }
}

// GET /api/products/view/:id
export async function getProductDetailsView(req, res) {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) return res.status(404).send('Producto no encontrado');
        res.render('products', { product });
    } catch (error) {
        res.status(500).send('Error al cargar la vista');
    }
}

// PUT /api/products/view/:id
export async function updateProductView(req, res) {
    try {
        await ProductModel.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/api/products/view/home');
    } catch (error) {
        res.status(500).send('Error al actualizar el producto');
    }
}

// DELETE /api/products/view/:id
export async function deleteProductView(req, res) {
    try {
        await ProductModel.findByIdAndDelete(req.params.id);
        res.redirect('/api/products/view/home');
    } catch (error) {
        res.status(500).send('Error al eliminar el producto');
    }
}

// POST /api/seed
export async function seedProducts(req, res) {
    try {
        const sample = [
            { title: 'Producto A', description: 'Desc A', price: 100 },
            { title: 'Producto B', description: 'Desc B', price: 200 }
        ];
        await ProductModel.insertMany(sample);
        res.success('Productos iniciales cargados');
    } catch (error) {
        res.internalError('Error al cargar los productos iniciales');
    }
}