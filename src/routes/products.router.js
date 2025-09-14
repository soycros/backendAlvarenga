import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import { io } from '../app.js';
import { getProducts } from '../controllers/products.controller.js';

router.get('/', getProducts);

const router = Router();
const productManager = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  product ? res.json(product) : res.status(404).json({ error: 'Producto no encontrado' });
});

router.post('/', async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  const updated = await productManager.getProducts();
  io.emit('update-products', updated);
  res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
  const updated = await productManager.updateProduct(req.params.pid, req.body);
  updated ? res.json(updated) : res.status(404).json({ error: 'Producto no encontrado' });
});

router.delete('/:pid', async (req, res) => {
  await productManager.deleteProduct(req.params.pid);
  const updated = await productManager.getProducts();
  io.emit('update-products', updated);
  res.status(204).send();
});

export default router;
