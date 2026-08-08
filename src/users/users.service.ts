async getOrders(userId: number) {
    console.log(`\n[FETCHING ORDERS FOR USER ${userId}]`);
    const ordersResult = await this.pool.query(
      `SELECT o.*, oi.*, p.* 
       FROM orders o 
       LEFT JOIN order_items oi ON o.id = oi.order_id 
       LEFT JOIN products p ON oi.product_id = p.id 
       WHERE o.user_id = $1 
       ORDER BY o.id DESC`,
      [userId]
    );
    const orders = ordersResult.rows.reduce((acc, row) => {
      const { id, ...order } = row;
      if (!acc[id]) {
        acc[id] = { ...order, items: [] };
      }
      if (row.item_id) {
        acc[id].items.push({ product_id: row.product_id, ...row });
      }
      return acc;
    }, {});
    return Object.values(orders);
  }