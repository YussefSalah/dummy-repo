import { DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { CheckoutDto } from './dto/checkout.dto';
import { UsersService } from '../users/users.service';
export declare class OrdersService {
    private dataSource;
    private usersService;
    private readonly logger;
    constructor(dataSource: DataSource, usersService: UsersService);
    checkout(userId: string, checkoutDto: CheckoutDto): Promise<Order>;
}
