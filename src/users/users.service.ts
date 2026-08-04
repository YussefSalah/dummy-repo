import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UsersService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async getOrders(userId: number) {
    console.log(`\n[N+1 QUERY TRIGGERED] Fetching orders for user ${userId}...`);
    // 1 query to get orders
    const ordersResult = await this.pool.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
    const orders = ordersResult.rows;

    // N queries to get items
    for (let order of orders) {
      const itemsResult = await this.pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
      order.items = itemsResult.rows;

      // N*M queries to get product details (N+1 trap!)
      for (let item of order.items) {
        const productResult = await this.pool.query('SELECT * FROM products WHERE id = $1', [item.product_id]);
        item.product = productResult.rows[0];
      }
    }
    return orders;
  }

  async create(name: string, email: string) {
    console.log('\n[UNIQUE CONSTRAINT TRIGGERED] Attempting to create user...');
    const result = await this.pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
      [name, email],
    );
    return result.rows[0];
  }
}
