const { Pool } = require('pg');
const dotenv= require('dotenv');
dotenv.config();
const pool =  new Pool({
  user: "postgres",
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME,
  password: "postgres",
  port: process.env.DB_PORT, 
});

// Test database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('PostgreSQL connection error', err.stack));
module.exports = pool;
