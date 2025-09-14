import { Router } from 'express';
import Cart from '../models/Cart.js';
import {
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  clearCart
} from '../controllers/carts.controller.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', cart: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid', clearCart);

export default router;
