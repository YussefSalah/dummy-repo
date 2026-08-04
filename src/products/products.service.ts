async getFeatured() {
    console.log('\n[TYPE_ERROR TRIGGERED] Fetching featured product...');
    const result = await this.pool.query('SELECT * FROM products LIMIT 1');
    const product = result.rows[0];
    
    // Add null checks to avoid TypeError
    const rating = product.metadata ? product.metadata.rating : null;
    
    return { ...product, rating };
  }