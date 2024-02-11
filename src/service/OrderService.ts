import { OrderRepository } from '../repository/OrderRepository';
import { Order } from '../entity/Order';
import {Book} from '../entity/Book';
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.getAllOrders();
  }

  async addOrder(newOrder: Order): Promise<void> {
    const customerPoints = await this.orderRepository.getCustomerPoints(newOrder.customer.id);
    const pointsToDeduct = newOrder.quantity * newOrder.total;
    
    if (customerPoints < pointsToDeduct) {
      return Promise.reject('Insufficient points to make the purchase');
    }
  const remaingPoints=customerPoints-pointsToDeduct;
  await this.orderRepository.addOrder(newOrder, remaingPoints);
   
  }

  async cancelOrder(orderId: number): Promise<void> {
    try {
      const order = await this.orderRepository.getOrderById(orderId);

      if (!order) {
        return Promise.reject('Order not found');
      }
      await this.orderRepository.cancelOrder(orderId);
    } catch (error) {
      console.error('Error in cancelOrder:', error);
      return Promise.reject(error);
    }
  }

  
  async getOrderById(orderId: number): Promise<Order | null> {
    try {
      const order = await this.orderRepository.getOrderById(orderId);
      return order || null;
    } catch (error) {
      throw error;
    }
  }
  async getOrdersByCustomerId(customerId: number): Promise<Order[]|null> {
    try {
      const order = await this.orderRepository.getOrdersByCustomerId(customerId);
      return order || null;
    } catch (error) {
      throw error;
    }
  }
}
