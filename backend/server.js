require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const connectDB = require('./config/database'); // Descomentar si se usa MongoDB

const chatRoutes = require('./routes/chat');
const botRoutes = require('./routes/bots');

const app = express();

// Conectar a la base de datos (opcional por ahora)
// connectDB();

// Middlewares
const rateLimit = require('express-rate-limit');

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'https://profound-bienenstitch-ac7933.netlify.app'], // Permitir el frontend local y el de producción
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permitir todos los métodos HTTP
  credentials: true, // Permitir el envío de cookies de origen cruzado
}));
app.use(express.json()); // Para parsear el body de las peticiones como JSON
app.use(express.urlencoded({ extended: true })); // Para parsear cuerpos de URL-encoded

app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});

// Configurar Express para que confíe en el proxy (necesario para el rate limiting cuando se usa un proxy como el de React dev server)
app.set('trust proxy', 1);

// Configuración de Rate Limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // Limita cada IP a 30 solicitudes por minuto (30 RPM de Google)
  message: 'Demasiadas solicitudes desde esta IP, por favor, inténtalo de nuevo en un minuto.',
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Aplicar el rate limiting a todas las solicitudes
app.use(limiter);

const authenticateApiKey = require('./middleware/authenticateApiKey');

// Rutas de la API
app.use('/api/chat', authenticateApiKey, chatRoutes);
app.use('/api/bots', authenticateApiKey, botRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('API de ExpertBot Hub funcionando!');
});

const PORT = process.env.PORT || 5002;

const geminiService = require('./services/gemini');

// ... (resto del código)

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
