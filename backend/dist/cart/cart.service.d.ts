import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from '../products/products.service';
export declare class CartService {
    private cartRepository;
    private cartItemRepository;
    private productsService;
    constructor(cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, productsService: ProductsService);
    getCart(userId: string): Promise<Cart>;
    addItem(userId: string, productId: string, quantity: number): Promise<Cart>;
    updateItem(userId: string, productId: string, quantity: number): Promise<Cart>;
    removeItem(userId: string, productId: string): Promise<Cart>;
    clearCart(userId: string): Promise<Cart>;
}
