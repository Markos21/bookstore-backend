import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.1.0',
    info: {
      title: 'Bookstore API',
      version: '1.0.0',
      description: 'API documentation for the Bookstore application',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
  },
  apis: ['src/controller/*.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;

