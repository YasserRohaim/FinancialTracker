const { Pool } = require('pg');
const dotenv= require('dotenv');
dotenv.config();
const pool =  new Pool({
  user: "postgres",
  host: "localhost", 
  database: "finance_tracker",
  password: "postgres",
  port: 5432, 
});

// Test database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('PostgreSQL connection error', err.stack));
module.exports = pool;
