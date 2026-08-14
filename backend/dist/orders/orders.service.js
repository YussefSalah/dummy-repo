"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const cart_entity_1 = require("../cart/entities/cart.entity");
const product_entity_1 = require("../products/entities/product.entity");
const users_service_1 = require("../users/users.service");
let OrdersService = OrdersService_1 = class OrdersService {
    dataSource;
    usersService;
    logger = new common_1.Logger(OrdersService_1.name);
    constructor(dataSource, usersService) {
        this.dataSource = dataSource;
        this.usersService = usersService;
    }
    async checkout(userId, checkoutDto) {
        this.logger.log('Checkout request received');
        return this.dataSource.transaction(async (manager) => {
            const user = await this.usersService.findById(userId);
            if (!user)
                throw new common_1.BadRequestException('User not found');
            const cart = await manager.findOne(cart_entity_1.Cart, {
                where: { userId },
                relations: { items: { product: true } },
            });
            if (!cart || !cart.items || cart.items.length === 0) {
                throw new common_1.BadRequestException('Cart is empty');
            }
            let totalAmount = 0;
            const orderItemsToCreate = [];
            for (const item of cart.items) {
                const product = await manager.findOne(product_entity_1.Product, {
                    where: { id: item.product.id },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!product || product.stock < item.quantity) {
                    throw new common_1.BadRequestException(`Not enough stock for ${item.product.name}`);
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
                product.stock -= item.quantity;
                await manager.save(product);
            }
            const order = manager.create(order_entity_1.Order, {
                userId: user.id,
                user: user,
                userName: checkoutDto.userName,
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
                const orderItem = manager.create(order_item_entity_1.OrderItem, {
                    order: savedOrder,
                    ...oi,
                });
                await manager.save(orderItem);
            }
            await manager.delete('cart_items', { cart: { id: cart.id } });
            this.logger.log('Order created successfully');
            return savedOrder;
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        users_service_1.UsersService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map