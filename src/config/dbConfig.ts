import pgPromise from 'pg-promise';

const pgp = pgPromise();
const connection = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'bookstore',
  user: process.env.DB_USER || 'your_username',
  password: process.env.DB_PASSWORD || 'your_password',
};



const db = pgp(connection);

// Function to connect to the database
export const connectDatabase = async () => {
  try {
    await db.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

export { db, pgp };