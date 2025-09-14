import { Router } from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = Router();

// 🏠 Vista principal con paginación y filtros
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, sort, query } = req.query;

  const filter = {};
  if (query) {
    if (query === 'true' || query === 'false') {
      filter.status = query === 'true';
    } else {
      filter.category = query;
    }
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    lean: true
  };

  try {
    const result = await Product.paginate(filter, options);

    res.render('index', {
      products: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/?page=${result.nextPage}` : null,
      cartId: '68c74924998577524dae3215'
    });
  } catch (error) {
    console.error('❌ Error en la ruta /:', error);
    res.status(500).send('Error al cargar productos');
  }
});

// 🔍 Vista de detalle de producto
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).send('Producto no encontrado');

    res.render('productDetail', {
      ...product.toObject(),
      cartId: '68c74924998577524dae3215'
    });
  } catch (error) {
    console.error('❌ Error al cargar detalle:', error);
    res.status(400).send('ID inválido');
  }
});

// 🛒 Vista de carrito
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).send('Carrito no encontrado');

    res.render('cart', cart.toObject());
  } catch (error) {
    console.error('❌ Error al cargar carrito:', error);
    res.status(400).send('ID inválido');
  }
});

// 🧪 Ruta de diagnóstico
router.get('/debug', async (req, res) => {
  try {
    const productos = await Product.find({});
    console.log('🧪 Productos desde MongoDB:', productos);
    res.json(productos);
  } catch (error) {
    console.error('❌ Error al leer productos:', error);
    res.status(500).json({ error: 'Error al leer productos desde MongoDB' });
  }
});

export default router;
