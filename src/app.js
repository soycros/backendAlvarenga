import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import path from 'path';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import ProductManager from './managers/ProductManager.js';
import connectDB from './config/db.js';
import viewsRouter from './routes/views.router.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = 8080;

connectDB();

const httpServer = app.listen(PORT, () =>
  console.log(`Servidor escuchando en puerto ${PORT}`)
);
const io = new Server(httpServer);
export { io };

const productManager = new ProductManager('./src/data/products.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('./src/public')));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve('./src/views'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use('/', viewsRouter);

app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
});

app.get('/home', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

io.on('connection', socket => {
  console.log('Cliente conectado');

  socket.on('new-product', async product => {
    await productManager.addProduct(product);
    const updated = await productManager.getProducts();
    io.emit('update-products', updated);
  });

  socket.on('delete-product', async pid => {
    await productManager.deleteProduct(pid);
    const updated = await productManager.getProducts();
    io.emit('update-products', updated);
  });
});

app.use(errorHandler);
