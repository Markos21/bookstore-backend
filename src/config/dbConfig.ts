import pgPromise from 'pg-promise';

const pgp = pgPromise();

const connection = {
  connectionString: process.env.DATABASE_URL || '',
  ssl: process.env.NODE_ENV === 'production', // Enable SSL in production on Glitch
};

const db = pgp(connection);

// Function to connect to the database with retry
export const connectDatabase = async () => {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      await db.connect();
      console.log('Connected to the database');
      return; // Connection successful, exit the function
    } catch (error) {
      retryCount++;
      console.error(`Error connecting to the database (Attempt ${retryCount}/${maxRetries}):`, error);

      if (retryCount < maxRetries) {
        // Wait for a moment before retrying (you can adjust the delay)
        const delayMs = 1000;
        console.log(`Retrying in ${delayMs / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        // Maximum retries reached, throw the error
        console.error('Max retry attempts reached. Unable to connect to the database.');
        throw error;
      }
    }
  }
};

export { db, pgp };
