const pool = require('./db');

const createTables = async () => {
  try {
    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        base_currency VARCHAR(3) DEFAULT 'USD',
        current_budget NUMERIC DEFAULT 0
      );
    `);
    console.log('Users table created successfully.');

    // Create Transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount NUMERIC NOT NULL,
        original_currency VARCHAR(3) NOT NULL,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        description TEXT
      );
    `);
    console.log('Transactions table created successfully.');
  } catch (err) {
    console.error('Error creating tables', err);
  } finally {
    pool.end(); // Close the database connection pool
  }
};

createTables();
