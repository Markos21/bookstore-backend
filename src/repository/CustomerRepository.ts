import { IDatabase, IMain } from 'pg-promise';
import { Customer } from '../entity/Customer';
import { db, pgp } from '../config/dbConfig';

export class CustomerRepository {
  constructor(private db: IDatabase<any>, private pgp: IMain) {}

  async getAllCustomers(): Promise<Customer[]> {
    try {
      return await this.db.any('SELECT * FROM customers');
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async addCustomer(newCustomer: Customer): Promise<void> {
    try {
      // Check if the email is already taken
      const existingUser = await this.db.oneOrNone('SELECT id FROM users WHERE email = $1', [newCustomer.email]);
  
      if (existingUser) {
        // Email is already taken, return an error
        return Promise.reject('Email is already taken');
      }
  
      // Email is not taken, proceed with the insertion
      const result = await this.db.one('INSERT INTO users(email, password, role_id) VALUES($1, $2, $3) RETURNING id', [newCustomer.email, newCustomer.password, 2]);
  
      await this.db.none('INSERT INTO customers(user_id, name, points) VALUES($1, $2, $3)', [result.id, newCustomer.name, newCustomer.points]);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  


  async deductPoints(customerId: number, pointsToDeduct: number): Promise<void> {
    try {
      await this.db.none('UPDATE customers SET points = points - $1 WHERE id = $2', [pointsToDeduct, customerId]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async doesCustomerExist(customerId: number): Promise<boolean> {
    try {
      const customer = await this.db.oneOrNone('SELECT * FROM customers WHERE id = $1', customerId);
      return !!customer;
    } catch (error) {
      console.error('Error checking customer existence:', error);
      return false; // Handle the error appropriately in your application
    }
  }

}

const customerRepository = new CustomerRepository(db, pgp);
export { customerRepository };
