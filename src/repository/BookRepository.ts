// src/repository/BookRepository.ts
import { IDatabase, IMain } from 'pg-promise';
import { Book } from '../entity/Book';
import { db, pgp } from '../config/dbConfig';

export class BookRepository {
  constructor(private db: IDatabase<any>, private pgp: IMain) {}

 async getBooks(page: number=1, pageSize: number = 10): Promise<Book[]> {
  try {
    const offset = (page - 1) * pageSize;
    return await this.db.any('SELECT * FROM books ORDER BY id OFFSET $1 LIMIT $2', [offset, pageSize]);
  } catch (error) {
    return Promise.reject(error);
  }
}

  async addBook(newBook: Book): Promise<void> {
    try {
      await this.db.none('INSERT INTO books(title, writer, cover_image_url, price, tags) VALUES($1, $2, $3, $4, $5)', [
        newBook.title,
        newBook.writer,
        newBook.coverImageUrl,
        newBook.price,
        newBook.tags,
      ]);
    } catch (error) {
      return Promise.reject(error); 
    }
  }

  async getBookById(bookId: number): Promise<Book > {
    try {
      const book = await this.db.oneOrNone('SELECT * FROM books WHERE id = $1', bookId);
      return book ;
    } catch (error) {
      console.error('Error in getBookById:', error);
      return Promise.reject(error);
    }
  }

  async getTotalBooksCount(): Promise<number> {
    try {
      const result = await this.db.one('SELECT COUNT(*) FROM books');
      return result.count;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

const bookRepository = new BookRepository(db, pgp);
export { bookRepository };
