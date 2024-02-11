import express, { Request, Response } from 'express';
import { Book } from '../entity/Book';
import { BookService } from '../service/BookService';
import { bookRepository } from '../repository/BookRepository';
import { apiReturnFormat } from '../util/apiReturnFormat';

const router = express.Router();
const bookService = new BookService(bookRepository);

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Operations related to books
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books with pagination
 *     description: Retrieve a list of books with optional pagination parameters.
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: { result: true, message: 'Books retrieved successfully', data: { books: [ ... ], totalItems: 42 } }
 */



router.get('/', async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.query.page) || 1;
    const pageSize: number = Number(req.query.pageSize) || 10;

    const result = await bookService.getBooks(page, pageSize);
    apiReturnFormat.success(res, 'Books retrieved successfully', result);
  } catch (error) {
    apiReturnFormat.exception(res, error as Error);
  }
});




/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     description: Add a new book to the bookstore
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               writer:
 *                 type: string
 *               coverImageUrl:
 *                 type: string
 *               price:
 *                 type: number
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - title
 *               - writer
 *               - coverImageUrl
 *               - price
 *               - tags
 *     responses:
 *       '201':
 *         description: Book added successfully
 *         content:
 *           application/json:
 *             example: { result: true, message: 'Book added successfully', data: { ... } }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const newBook: Book = req.body;
    await bookService.addBook(newBook);
    apiReturnFormat.success(res, 'Book added successfully', newBook);
  } catch (error) {
    console.error('Error adding book:', error);
    apiReturnFormat.exception(res, error as Error);
  }
});

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search books by title
 *     description: Retrieve a list of books based on their title
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         description: Title of the book to search for
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: { result: true, message: 'Books retrieved successfully', data: [...] }
 *       '404':
 *         description: No books found
 *         content:
 *           application/json:
 *             example: { result: false, message: 'No books found', data: null }
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const title: string = req.query.title as string;
    const books: Book[] = await bookService.searchBooksByTitle(title);

    if (books.length > 0) {
      apiReturnFormat.success(res, 'Books retrieved successfully', books);
    } else {
      apiReturnFormat.notFound(res, 'No books found');
    }
  } catch (error) {
    apiReturnFormat.exception(res, error as Error);
  }
});


/**
 * @swagger
 * /books/{bookId}:
 *   get:
 *     summary: Get book by ID
 *     description: Retrieve details of a specific book by its ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: ID of the book to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: { result: true, message: 'book retrieved successfully', data: { ... } }
 *       '404':
 *         description: book not found
 *         content:
 *           application/json:
 *             example: { result: false, message: 'book not found', data: null }
 */
router.get('/:bookId', async (req: Request, res: Response) => {
  try {
    const bookId: number = parseInt(req.params.bookId, 10); 
    const book: Book | null = await bookService.getBookById(bookId);

    if (book) {
      apiReturnFormat.success(res, 'Book retrieved successfully', book);
    } else {
      apiReturnFormat.notFound(res, 'Book not found');
    }
  } catch (error) {
    apiReturnFormat.exception(res, error as Error);
  }
});



export default router;

