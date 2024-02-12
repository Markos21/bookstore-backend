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
        url: 'https://bookstore-api-clxp.onrender.com/api',
        description: 'Live server',
      },
    ],
  },
  apis: ['src/controller/*.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;

