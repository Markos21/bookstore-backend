import { Customer } from './Customer';
import { Book } from './Book';
import { Status } from './Status';

export interface Order {
  id: number;
  customerId: number;
  bookId: number;
  orderDate: Date;
  quantity:number;
  total:number;
  status: Status;
  customer: Customer; 
  book: Book[]; 
  address:string;
  city:string;
  state:string;
  zip:string;
  phonenumber:string;
}
