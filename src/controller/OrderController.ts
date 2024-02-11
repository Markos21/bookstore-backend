import express, { Request, Response } from 'express';
import { Order } from '../entity/Order';
import { OrderService } from '../service/OrderService';
import { orderRepository } from '../repository/OrderRepository';
import { apiReturnFormat } from '../util/apiReturnFormat';

const router = express.Router();
const orderService = new OrderService(orderRepository);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Operations related to orders
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve a list of orders
 *     tags: [Orders]
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: { result: true, message: 'Orders retrieved successfully', data: [ ... ] }
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const orders: Order[] = await orderService.getAllOrders();
    apiReturnFormat.success(res, 'Orders retrieved successfully', orders);
  } catch (error) {
    apiReturnFormat.exception(res, error as Error);
  }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order
 *     description: Place a new order for a book
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID of the customer placing the order
 *               book:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID of the book to be ordered
 *                     price:
 *                       type: integer
 *                       description: Price of the book to be ordered
 *               quantity:
 *                 type: number
 *                 description: quantity
 *               total:
 *                 type: number
 *                 description: quantity
 *               address:
 *                 type: string
 *                 description: Shipping address
 *               zip:
 *                 type: string
 *                 description: ZIP code
 *               city:
 *                 type: string
 *                 description: City
 *               state:
 *                 type: string
 *                 description: State
 *               phonenumber:
 *                 type: string
 *                 description: Phone number
 *             required:
 *               - customer
 *               - book
 *               - quantity
 *               - total
 *               - address
 *               - zip
 *               - city
 *               - state
 *               - phonenumber
 *     responses:
 *       '201':
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             example: { success: true, message: 'Order placed successfully', data: { orderId: 123 } }
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example: { success: false, message: 'Bad Request', error: 'Error message' }
 */

router.post('/', async (req: Request, res: Response) => {
  try {
    const newOrder: Order = req.body;
     await orderService.addOrder(newOrder);
    apiReturnFormat.success(res, 'Order placed successfully');
  } catch (error) {
    console.error('Error placing order:', error);
    apiReturnFormat.exception(res, error as Error);
  }
});

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get order by ID
 *     description: Retrieve details of a specific order by its ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID of the order to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: { result: true, message: 'Order retrieved successfully', data: { ... } }
 *       '404':
 *         description: Order not found
 *         content:
 *           application/json:
 *             example: { result: false, message: 'Order not found', data: null }
 */
router.get('/:orderId', async (req: Request, res: Response) => {
  try {
    const orderId: number = parseInt(req.params.orderId, 10);
    const order: Order | null = await orderService.getOrderById(orderId);

    if (order) {
      apiReturnFormat.success(res, 'Order retrieved successfully', order);
    } else {
      apiReturnFormat.notFound(res, 'Order not found');
    }
  } catch (error) {
    apiReturnFormat.exception(res, error as Error);
  }
});

/**
 * @swagger
 * /orders/{orderId}:
 *   put:
 *     summary: Cancel order by ID
 *     description: Cancel a specific order by its ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID of the order to cancel
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Order canceled successfully
 *       '404':
 *         description: Order not found
 *         content:
 *           application/json:
 *             example: { result: false, message: 'Order not found', data: null }
 */

router.put('/:orderId', async (req: Request, res: Response) => {
  try {
    const orderId: number = parseInt(req.params.orderId);
    await orderService.cancelOrder(orderId);

    apiReturnFormat.noContent(res, 'Order canceled successfully');
  } catch (error) {
    console.error('Error canceling order by ID:', error);
    apiReturnFormat.exception(res, error as Error);
  }
});




export default router;
