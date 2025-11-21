const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const routes = require('./routes');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

/**
 * Load environment variables from .env for:
 * - CORS_ORIGIN (single or comma-separated list)
 * - JWT_SECRET, JWT_EXPIRES_IN
 * - DATABASE_URL or PG* variables for PostgreSQL
 */
dotenv.config();

// Initialize express app
const app = express();

// CORS from env (fallback to '*' only in development when not specified)
const rawOrigin = process.env.CORS_ORIGIN;
const corsOrigin = rawOrigin
  ? rawOrigin.split(',').map((s) => s.trim())
  : (process.env.NODE_ENV === 'development' ? '*' : []);
app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.set('trust proxy', true);

// Swagger with dynamic server URL for accurate docs
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  let protocol = req.protocol;

  const actualPort = req.socket?.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      { url: `${protocol}://${fullHost}` },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body
app.use(express.json());

// Mount routes
app.use('/', routes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Error handling middleware
// PUBLIC_INTERFACE
/**
 * Global error handler.
 * Returns 400 for validation errors and 500 for unexpected errors.
 */
app.use((err, req, res, next) => {
  // Joi validation error
  if (err && err.isJoi) {
    return res.status(400).json({
      status: 'error',
      message: err.details?.map(d => d.message).join(', ') || 'Validation error',
    });
  }
  // Known error with status
  if (err && err.status) {
    return res.status(err.status).json({ status: 'error', message: err.message });
  }
  console.error(err?.stack || err);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

module.exports = app;
