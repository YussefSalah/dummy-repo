import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productsService: ProductsService,
  ) {}

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: { items: { product: true } },
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId });
      await this.cartRepository.save(cart);
      cart.items = [];
    }

    return cart;
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await this.productsService.findOne(productId);
    
    if (product.stock < quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    const cart = await this.getCart(userId);
    let cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cart.id }, product: { id: productId } },
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new BadRequestException('Not enough stock available');
      }
      cartItem.quantity = newQuantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return this.getCart(userId);
  }

  async updateItem(userId: string, productId: string, quantity: number) {
    const product = await this.productsService.findOne(productId);
    
    if (product.stock < quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    const cart = await this.getCart(userId);
    const cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cart.id }, product: { id: productId } },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not in cart');
    }

    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);
    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.getCart(userId);
    await this.cartItemRepository.delete({ cart: { id: cart.id }, product: { id: productId } });
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    await this.cartItemRepository.delete({ cart: { id: cart.id } });
    return this.getCart(userId);
  }
}
