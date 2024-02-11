import { IDatabase, IMain } from 'pg-promise';
import { db, pgp } from '../config/dbConfig';

export class LoginRepository {
    constructor(private db: IDatabase<any>, private pgp: IMain) {}

    async getUserByEmail(email: string): Promise<any> {
      try {
        const user = await this.db.oneOrNone(
          `SELECT users.*, customers.name AS customer_name, customers.points
           FROM users
           LEFT JOIN customers ON users.id = customers.user_id
           WHERE users.email = $1`,
          email
        );
    
        return user;
      } catch (error) {
        console.error('Error getting user by email:', error);
        throw error; 
      }
    }
    
}

const loginRepository = new LoginRepository(db, pgp);
export { loginRepository };
