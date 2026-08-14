import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
export declare class OrdersController {
    private readonly ordersService;
    private readonly logger;
    constructor(ordersService: OrdersService);
    checkout(req: any, checkoutDto: CheckoutDto): Promise<import("./entities/order.entity").Order>;
}
