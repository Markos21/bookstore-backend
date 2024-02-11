import { User } from "./User";

export interface Customer {
    id: number;
    name: string;
    user:User
    points: number;
    email:string,
    password:string
  }
  