import { Book } from '../entity/Book';
import { BookRepository } from '../repository/BookRepository';

export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async getBooks(page: number, pageSize: number): Promise<{ books: Book[], totalItems: number }> {
    try {
      const actualPage = page || 1;
      const actualPageSize = pageSize || 10;
  
      const offset = (actualPage - 1) * actualPageSize;
  
      const books: Book[] = await this.bookRepository.getBooks(actualPage, actualPageSize);
      const totalItems: number = await this.bookRepository.getTotalBooksCount();
  
      return { books, totalItems };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async addBook(newBook: Book): Promise<void> {
    return this.bookRepository.addBook(newBook);
  }

  async getBookById(bookId: number): Promise<Book | null> {
    try {
      const book = await this.bookRepository.getBookById(bookId);
      return book || null;
    } catch (error) {
      throw error;
    }
  }

   async searchBooksByTitle(title: string): Promise<Book[]>  {
    try {
      const allBooks: Book[] = await this.bookRepository.getBooks();
      const filteredBooks: Book[] = allBooks.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
      return filteredBooks;
    } catch (error) {
      throw error;
    }
    
  };

  
}
