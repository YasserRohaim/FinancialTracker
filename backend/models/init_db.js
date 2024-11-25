const pool = require('./db'); // Ensure this points to your db.js file

const createTables = async () => {
  try {
    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);
    console.log('Users table created successfully.');

    // Create Transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        amount NUMERIC NOT NULL,
        description TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Transactions table created successfully.');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    try {
      // Ensure the connection pool is closed
      await pool.end();
      console.log('Database connection closed.');
    } catch (endErr) {
      console.error('Error closing the connection pool:', endErr);
    }
    // Explicitly exit the process
    process.exit(0);
  }
};

createTables();
