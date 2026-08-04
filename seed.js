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
        total INTEGER NOT NULL
      );

      CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL
      );
    `);

    console.log('Inserting dummy data...');
    // Insert Users
    const userRes = await client.query(`
      INSERT INTO users (name, email) VALUES 
        ('Alice Smith', 'alice@example.com'),
        ('Bob Jones', 'bob@example.com'),
        ('Charlie Brown', 'charlie@example.com')
      RETURNING id;
    `);
    
    // Insert Products
    const productRes = await client.query(`
      INSERT INTO products (name, price) VALUES 
        ('Laptop', 99900),
        ('Smartphone', 59900),
        ('Headphones', 14900),
        ('Keyboard', 8900),
        ('Mouse', 4900)
      RETURNING id;
    `);

    // Insert Orders for Alice
    const aliceId = userRes.rows[0].id;
    const laptopId = productRes.rows[0].id;
    const headphonesId = productRes.rows[2].id;
    
    const orderRes = await client.query(`
      INSERT INTO orders (user_id, total) VALUES 
        ($1, 114800),
        ($1, 4900)
      RETURNING id;
    `, [aliceId]);

    // Insert Order Items
    const order1Id = orderRes.rows[0].id;
    await client.query(`
      INSERT INTO order_items (order_id, product_id, quantity) VALUES 
        ($1, $2, 1),
        ($1, $3, 1)
    `, [order1Id, laptopId, headphonesId]);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
