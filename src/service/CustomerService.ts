import { CustomerRepository } from '../repository/CustomerRepository';
import { Customer } from '../entity/Customer';

export class CustomerService {
  constructor(private customerRepository: CustomerRepository) {}

  async getAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.getAllCustomers();
  }

  async addCustomer(newCustomer: Customer): Promise<Customer> {
    newCustomer.points = 100; // New customers get 100 points
    await this.customerRepository.addCustomer(newCustomer);
    return newCustomer;
  }

  async deductPoints(customerId: number, pointsToDeduct: number): Promise<void> {
    await this.customerRepository.deductPoints(customerId, pointsToDeduct);
  }
  async doesCustomerExist(customerId: number): Promise<boolean> {
    return await this.customerRepository.doesCustomerExist(customerId);
  }

}
