const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'root',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ecommerce',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5434,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
