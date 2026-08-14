import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';
export declare class CartItem {
    id: string;
    cart: Cart;
    product: Product;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}
