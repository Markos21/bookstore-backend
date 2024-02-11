import express, { Request, Response } from 'express';
import { Customer } from '../entity/Customer';
import { CustomerService } from '../service/CustomerService';
import { customerRepository } from '../repository/CustomerRepository';
import { apiReturnFormat } from '../util/apiReturnFormat';
import { orderRepository } from '../repository/OrderRepository';
import { OrderService } from '../service/OrderService';

const router = express.Router();
const customerService = new CustomerService(customerRepository);
const orderService = new OrderService(orderRepository);

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Operations related to customers
 */


/**
 * @swagger
 * /customers/{customerId}/orders:
 *   get:
 *     summary: Get orders for a specific customer
 *     description: Retrieve a list of orders for a specific customer by their ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         description: ID of the customer to retrieve orders for
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: { result: true, message: 'Orders retrieved successfully', data: [ ... ] }
 *       '404':
 *         description: Customer not found
 *         content:
 *           application/json:
 *             example: { result: false, message: 'Customer not found', data: null }
 */
router.get('/:customerId/orders', async (req: Request, res: Response) => {
  try {
    const customerId: number = parseInt(req.params.customerId, 10);
    // Check if the customer exists
    const customerExists = await customerService.doesCustomerExist(customerId);

    if (customerExists) {
      // Customer exists, proceed to retrieve orders
      const orders = await orderService.getOrdersByCustomerId(customerId);
      apiReturnFormat.success(res, 'Orders retrieved successfully', orders);
    } else {
      // Customer not found
      apiReturnFormat.notFound(res, 'Customer not found');
    }
  } catch (error) {
    apiReturnFormat.exception(res, error as Error);
  }
});






/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     description: Retrieve a list of customers
 *     tags: [Customers]
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: { result: true, message: 'Customers retrieved successfully', data: [ ... ] }
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const customers: Customer[] = await customerService.getAllCustomers();
    apiReturnFormat.success(res, 'Customers retrieved successfully', customers);
  } catch (error) {
    apiReturnFormat.exception(res, error as Error);
  }
});


/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Register a new customer
 *     description: Register a new customer in the system
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: Customer registered successfully
 *         content:
 *           application/json:
 *             example: { result: true, message: 'Customer registered successfully', data: { ... } }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const newCustomer: Customer = req.body;
    await customerService.addCustomer(newCustomer);
    apiReturnFormat.success(res, 'Customer registered successfully', newCustomer);
  } catch (error) {
    console.error('Error adding customer:', error);
    apiReturnFormat.exception(res, error as Error); 
  }
});





export default router;
