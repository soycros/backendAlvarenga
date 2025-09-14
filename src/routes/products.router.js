import { Router } from 'express';
import Product from '../models/Product.js';
import { io } from '../app.js';

const router = Router();

// 🔍 Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// 🔍 Obtener producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    product
      ? res.json(product)
      : res.status(404).json({ error: 'Producto no encontrado' });
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// ➕ Crear nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    const updated = await Product.find({});
    io.emit('update-products', updated);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear producto' });
  }
});

// 🔄 Actualizar producto
router.put('/:pid', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, {
      new: true
    });
    updated
      ? res.json(updated)
      : res.status(404).json({ error: 'Producto no encontrado' });
  } catch (error) {
    res.status(400).json({ error: 'ID inválido o datos incorrectos' });
  }
});

// ❌ Eliminar producto
router.delete('/:pid', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.pid);
    const updated = await Product.find({});
    io.emit('update-products', updated);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar producto' });
  }
});

export default router;
