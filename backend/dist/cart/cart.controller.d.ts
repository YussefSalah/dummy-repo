import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<import("./entities/cart.entity").Cart>;
    addItem(req: any, addToCartDto: AddToCartDto): Promise<import("./entities/cart.entity").Cart>;
    updateItem(req: any, productId: string, updateCartItemDto: UpdateCartItemDto): Promise<import("./entities/cart.entity").Cart>;
    removeItem(req: any, productId: string): Promise<import("./entities/cart.entity").Cart>;
    clearCart(req: any): Promise<import("./entities/cart.entity").Cart>;
}
