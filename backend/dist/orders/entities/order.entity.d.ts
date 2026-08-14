import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
export declare class Order {
    id: string;
    user: User;
    userId: string;
    userName: string;
    totalAmount: string;
    status: string;
    shippingAddress: string;
    city: string;
    postalCode: string;
    country: string;
    paymentMethod: string;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}
