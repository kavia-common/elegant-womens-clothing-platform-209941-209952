const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Elegant Women Clothing API',
      version: '1.0.0',
      description: 'Backend API for products, orders, and authentication with admin panel features.',
    },
    tags: [
      { name: 'Health', description: 'Service health' },
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Products', description: 'Products browsing and admin management' },
      { name: 'Orders', description: 'Customer and admin order operations' },
      { name: 'Admin', description: 'Admin-only operations' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
