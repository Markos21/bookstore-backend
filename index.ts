import 'dotenv/config'; 
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { connectDatabase } from './src/config/dbConfig';
import specs from './src/config/swaggerConfig'; 


import bookController from './src/controller/BookController';
import orderController from './src/controller/OrderController'; 
import customerController from './src/controller/CustomerController'; 
import loginController from './src/controller/LoginController'; // Import the new controller
const cors = require('cors');



const app = express();
const PORT = process.env.PORT || 3000;


// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Database connection
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Server failed to start due to database connection error');
    process.exit(1);
  });

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// Register controllers
app.use('/api/books', bookController);
app.use('/api/orders', orderController); 
app.use('/api/customers', customerController); 
app.use('/api/login', loginController);



