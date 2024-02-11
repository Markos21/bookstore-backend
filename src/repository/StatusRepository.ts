import { IDatabase, IMain } from 'pg-promise';
import { db, pgp } from '../config/dbConfig';
import { Status } from '../entity/Status';

export class StatusRepository {
  constructor(private db: IDatabase<any>, private pgp: IMain) {}

  async getStatusByName(name: string): Promise<Status | null> {
    try {
      return await this.db.oneOrNone('SELECT * FROM statuses WHERE name = $1', name);
    } catch (error) {
      console.error('Error in getStatusByName:', error);
      return Promise.reject(error);
    }
  }

  // Add other repository methods as needed
}

const statusRepository = new StatusRepository(db, pgp);
export { statusRepository };