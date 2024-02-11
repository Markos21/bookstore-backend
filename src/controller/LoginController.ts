import express, { Request, Response } from 'express';
import { LoginService } from '../service/LoginService';
import { loginRepository } from '../repository/LoginRepository';
import { apiReturnFormat } from '../util/apiReturnFormat';

const router = express.Router();
const loginService = new LoginService(loginRepository);

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication operations
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and generate a token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             example: { result: true, message: 'Login successful', data: { userId: 1, role: 2, lastLogin: '2024-02-06T12:00:00Z' } }
 *       '400':
 *         description: Invalid input or credentials
 *         content:
 *           application/json:
 *             example: { result: false, message: 'Invalid input or credentials', error: 'User not found' }
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example: { result: false, message: 'Internal server error', error: 'Unexpected database error' }
 */

router.post('/', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await loginService.login(email, password);
  
      if (result && result.userId) {
        apiReturnFormat.success(res, 'Login successful', result);
      } else {
        apiReturnFormat.notFound(res, 'User not found or invalid password');
      }
    } catch (error) {
      apiReturnFormat.exception(res, error as Error);
    }
  });
  
  

export default router;