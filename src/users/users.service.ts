const orders = await this.orderRepository.createQueryBuilder('order')
    .leftJoinAndSelect('order.items', 'orderItem')
    .leftJoinAndSelect('orderItem.product', 'product')
    .where('order.userId = :userId', { userId })
    .getMany();
