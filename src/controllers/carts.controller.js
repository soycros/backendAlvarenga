import Cart from '../models/Cart.js';

// Obtener carrito por ID con populate
export const getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Agregar producto al carrito (incrementa si ya existe)
export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await Cart.findById(cid);
    const existing = cart.products.find(p => p.product.toString() === pid);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Eliminar producto específico del carrito
export const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await Cart.findById(cid);
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Reemplazar todo el contenido del carrito
export const updateCart = async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  try {
    const cart = await Cart.findById(cid);
    cart.products = products;
    await cart.save();

    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Actualizar cantidad de un producto específico
export const updateProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findById(cid);
    const item = cart.products.find(p => p.product.toString() === pid);

    if (item) {
      item.quantity = quantity;
      await cart.save();
      res.json({ status: 'success', cart });
    } else {
      res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Vaciar el carrito por completo
export const clearCart = async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await Cart.findById(cid);
    cart.products = [];
    await cart.save();

    res.json({ status: 'success', message: 'Carrito vaciado correctamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
