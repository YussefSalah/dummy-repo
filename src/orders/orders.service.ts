import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CheckoutDto } from './dto/checkout.dto';
import { Cart } from '../cart/entities/cart.entity';
import { Product } from '../products/entities/product.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private dataSource: DataSource,
    private usersService: UsersService,
  ) {}

  async checkout(userId: string, checkoutDto: CheckoutDto) {
    this.logger.log('Checkout request received');
    return this.dataSource.transaction(async (manager) => {
      const user = await this.usersService.findById(userId);
      if (!user) throw new BadRequestException('User not found');

      const cart = await manager.findOne(Cart, {
        where: { userId },
        relations: { items: { product: true } },
      });

      if (!cart || !cart.items || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      let totalAmount = 0;
      const orderItemsToCreate = [];

      for (const item of cart.items) {
        const product = await manager.findOne(Product, {
          where: { id: item.product.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product || product.stock < item.quantity) {
          throw new BadRequestException(`Not enough stock for ${item.product.name}`);
        }

        const price = parseFloat(product.price);
        const subtotal = price * item.quantity;
        totalAmount += subtotal;

        orderItemsToCreate.push({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: item.quantity,
          subtotal: subtotal.toString(),
        });

        // Decrease stock
        product.stock -= item.quantity;
        await manager.save(product);
      }

      const order = manager.create(Order, {
        userId: user.id,
        user: user,
        // CRITICAL BUG: Typos mapping user_name from the DTO!
        // We are trying to read `userName` but the DTO only has `user_name`.
        // This will insert `undefined` into the database, causing a violent 500 DB crash!
        userName: (checkoutDto as any).userName,
        shippingAddress: checkoutDto.shippingAddress,
        city: checkoutDto.city,
        postalCode: checkoutDto.postalCode,
        country: checkoutDto.country,
        paymentMethod: checkoutDto.paymentMethod,
        totalAmount: totalAmount.toString(),
        status: 'pending',
      });

      const savedOrder = await manager.save(order);

      for (const oi of orderItemsToCreate) {
        const orderItem = manager.create(OrderItem, {
          order: savedOrder,
          ...oi,
        });
        await manager.save(orderItem);
      }

      // Clear cart items
      await manager.delete('cart_items', { cart: { id: cart.id } });

      this.logger.log('Order created successfully');
      return savedOrder;
    });
  }
}
