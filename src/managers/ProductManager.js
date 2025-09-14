import fs from 'fs/promises';
import crypto from 'crypto';

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newProduct = {
      id: crypto.randomUUID(),
      status: true,
      thumbnails: [],
      ...product
    };
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates, id: products[index].id };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

async deleteProduct(id) {
  const products = await this.getProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    console.log(`❌ Producto con ID ${id} no encontrado`);
    return false;
  }

  products.splice(index, 1);
  await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  console.log(`✅ Producto con ID ${id} eliminado`);
  return true;
  }
}
