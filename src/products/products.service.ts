import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ProductsService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async getFeatured() {
    console.log('\n[TYPE_ERROR TRIGGERED] Fetching featured product...');
    const result = await this.pool.query('SELECT * FROM products LIMIT 1');
    const product = result.rows[0];
    
    // BUG: product.metadata is undefined, this will throw a TypeError!
    const rating = product.metadata.rating; 
    
    return { ...product, rating };
  }
}
