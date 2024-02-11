import { IDatabase, IMain } from "pg-promise";
import { Order } from "../entity/Order";
import { db, pgp } from "../config/dbConfig";

export class OrderRepository {
  constructor(private db: IDatabase<any>, private pgp: IMain) {}

  async getAllOrders(): Promise<Order[]> {
    try {
      return await this.db.any("SELECT * FROM orders");
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async addOrder(newOrder: Order, remaingPoints: number): Promise<void> {
    try {
      console.log("REMAING POINTS",remaingPoints)
      console.log("customer ID",newOrder.customer.id)
      const result = await this.db.tx(async (t) => {
        // Deduct points from the customer
        await t.none(
          "UPDATE customers SET points = points - $1 WHERE id = $2",
          [remaingPoints, newOrder.customer.id]
        );

        for (const book of newOrder.book) {
        console.log()
          // Insert the order into the orders
          const insertResult = await t.one(
            "INSERT INTO orders(customer_id, book_id, quantity, total, address, zip, city, state, phonenumber) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
            [
              newOrder.customer.id,
              book.id,
              newOrder.quantity,
              newOrder.total,
              newOrder.address,
              newOrder.zip,
              newOrder.city,
              newOrder.state,
              newOrder.phonenumber,
            ]
          );
        }
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async cancelOrder(orderId: number): Promise<void> {
    try {
      await this.db.none("UPDATE orders SET status_id = $1 WHERE id = $2", [
        3,
        orderId,
      ]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getCustomerPoints(customerId: number): Promise<number> {
    try {
      const customer = await this.db.one(
        "SELECT points FROM customers WHERE user_id = $1",
        customerId
      );
      return customer.points;
    } catch (error) {
      console.error("Error in getCustomerPoints:", error);
      return Promise.reject(error);
    }
  }

  async getOrderById(orderId: number): Promise<Order | null> {
    try {
      const order = await this.db.oneOrNone(
        "SELECT * FROM orders WHERE id = $1",
        orderId
      );
      return order || null;
    } catch (error) {
      console.error("Error in getOrderById:", error);
      return Promise.reject(error);
    }
  }

  async getOrdersByCustomerId(customerId: number): Promise<Order[] | null> {
    try {
      const query = `
        SELECT orders.*, orders.id as orderId, books.*,statuses.name as status
        FROM orders
        JOIN books ON orders.book_id = books.id
        JOIN statuses ON orders.status_id = statuses.id
        WHERE orders.customer_id = $1
      `;
      const orders = await this.db.manyOrNone(query, [customerId]);
      return orders || null;
    } catch (error) {
      console.error("Error in getOrdersByCustomerId:", error);
      return Promise.reject(error);
    }
  }
}

const orderRepository = new OrderRepository(db, pgp);
export { orderRepository };
