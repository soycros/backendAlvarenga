import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { errorHandler } from './middleware/errorHandler.js';
import Product from './models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// 🔌 Conexión a MongoDB
connectDB();

// 🚀 Arranque del servidor
const httpServer = app.listen(PORT, () =>
  console.log(`✅ Servidor escuchando en puerto ${PORT}`)
);

// 🔄 WebSocket
const io = new Server(httpServer);
export { io };

// 🧱 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 🎨 Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// 📦 Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// 🖼️ Rutas de vistas
app.use('/', viewsRouter);

// 🧪 Vista realtime con MongoDB
app.get('/realtimeproducts', async (req, res) => {
  const products = await Product.find({});
  res.render('realTimeProducts', { products });
});

// 🏠 Vista home con MongoDB
app.get('/home', async (req, res) => {
  const products = await Product.find({});
  res.render('home', { products });
});

// 🔁 WebSocket para productos
io.on('connection', socket => {
  console.log('🟢 Cliente conectado');

  socket.on('new-product', async product => {
    await Product.create(product);
    const updated = await Product.find({});
    io.emit('update-products', updated);
  });

  socket.on('delete-product', async pid => {
    await Product.findByIdAndDelete(pid);
    const updated = await Product.find({});
    io.emit('update-products', updated);
  });
});

// 🛡️ Middleware de errores
app.use(errorHandler);
