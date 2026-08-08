require('dotenv').config();
const { pool } = require('./db');

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Creating tables...');
    await client.query(`
      DROP TABLE IF EXISTS order_items;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS users;

      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL
      );

      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL
      );
    `);

    console.log('Inserting initial users & products...');
    const userRes = await client.query(`
      INSERT INTO users (name, email) VALUES 
        ('Alice Smith', 'alice@example.com'),
        ('Bob Jones', 'bob@example.com'),
        ('Charlie Brown', 'charlie@example.com')
      RETURNING id, email;
    `);

    const productRes = await client.query(`
      INSERT INTO products (name, price) VALUES 
        ('Nexus Pro Laptop', 129900),
        ('Wireless Noise-Canceling Headphones', 19900),
        ('Mechanical Gaming Keyboard', 11900),
        ('Ergonomic Wireless Mouse', 4900),
        ('4K Ultra HD Monitor', 44900)
      RETURNING id, price;
    `);

    const aliceId = userRes.rows[0].id;
    const products = productRes.rows;

    console.log('Seeding 1000 orders for testing query spans...');
    
    // Batch insert 1,000 orders for Alice
    const TOTAL_ORDERS = 1000;
    
    await client.query('BEGIN');
    
    for (let i = 1; i <= TOTAL_ORDERS; i++) {
      const prod = products[i % products.length];
      const qty = (i % 3) + 1;
      const orderTotal = prod.price * qty;
      
      const orderInsert = await client.query(
        'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id',
        [aliceId, orderTotal]
      );
      
      const orderId = orderInsert.rows[0].id;
      
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [orderId, prod.id, qty]
      );
    }
    
    await client.query('COMMIT');

    console.log(`Successfully seeded ${TOTAL_ORDERS} orders and order items!`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during seeding:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
