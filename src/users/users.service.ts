import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UsersService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findByEmail(email: string) {
    const res = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0] || null;
  }

  async getOrders(userId: number) {
    console.log(`\n[N+1 QUERY SPAN DEMO] Fetching orders for user ${userId}...`);
    // 1 query to get orders
    const ordersResult = await this.pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );
    const orders = ordersResult.rows;

    // N queries to get items (Demonstrates heavy query span traces)
    for (let order of orders) {
      const itemsResult = await this.pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
      order.items = itemsResult.rows;

      for (let item of order.items) {
        const productResult = await this.pool.query('SELECT * FROM products WHERE id = $1', [item.product_id]);
        item.product = productResult.rows[0];
      }
    }
    return orders;
  }

  async create(name: string, email: string) {
    console.log('\n[USER CREATION] Attempting to create user:', email);
    
    // Check duplicate
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new ConflictException(`User with email "${email}" already exists.`);
    }

    const result = await this.pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email',
      [name, email],
    );
    return result.rows[0];
  }
}

