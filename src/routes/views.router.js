import { Router } from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = Router();

router.get('/', async (req, res) => {
  const { page = 1, limit = 10, sort, query } = req.query;

  const filter = query
    ? { $or: [{ category: query }, { status: query === 'true' }] }
    : {};

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
  };

  const result = await Product.paginate(filter, options);

  res.render('index', {
    products: result.docs,
    page: result.page,
    totalPages: result.totalPages,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? `/?page=${result.prevPage}` : null,
    nextLink: result.hasNextPage ? `/?page=${result.nextPage}` : null,
    cartId: '64f0a1c2e5b9b2a7c8f1d123' // reemplazalo por el ID real del carrito
  });
});

router.get('/products/:pid', async (req, res) => {
  const product = await Product.findById(req.params.pid);
  res.render('productDetail', { ...product.toObject(), cartId: '64f0a1c2e5b9b2a7c8f1d123' });
});

router.get('/carts/:cid', async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate('products.product');
  res.render('cart', cart.toObject());
});

export default router;
