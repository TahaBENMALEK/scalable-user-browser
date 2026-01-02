/**
 * Swagger/OpenAPI Configuration
 * Defines API documentation structure and metadata
 */

const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');
const path = require('path');

// Debug: Check paths being scanned
const routePath = path.resolve(__dirname, '../routes/userRoutes.js');
const indexPath = path.resolve(__dirname, '../index.js');
console.log('Swagger scanning routes:', routePath);
console.log('Swagger scanning index:', indexPath);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scalable User Browser API',
      version: '1.0.0',
      description: 'REST API for browsing millions of usernames efficiently with cursor-based pagination',
      contact: {
        name: 'TahaBENMALEK',
        email: 'benmalektaha.inpt@gmail.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: config.server.baseUrl,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'System health check endpoints',
      },
      {
        name: 'Users',
        description: 'User browsing and pagination endpoints',
      },
    ],
  },
  apis: [
    path.resolve(__dirname, '../routes/userRoutes.js'),
    path.resolve(__dirname, '../index.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;