import { Order } from './order.entity';
export declare class OrderItem {
    id: string;
    order: Order;
    productId: string;
    productName: string;
    price: string;
    quantity: number;
    subtotal: string;
}
