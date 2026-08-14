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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("./entities/cart.entity");
const cart_item_entity_1 = require("./entities/cart-item.entity");
const products_service_1 = require("../products/products.service");
let CartService = class CartService {
    cartRepository;
    cartItemRepository;
    productsService;
    constructor(cartRepository, cartItemRepository, productsService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productsService = productsService;
    }
    async getCart(userId) {
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
    async addItem(userId, productId, quantity) {
        const product = await this.productsService.findOne(productId);
        if (product.stock < quantity) {
            throw new common_1.BadRequestException('Not enough stock available');
        }
        const cart = await this.getCart(userId);
        let cartItem = await this.cartItemRepository.findOne({
            where: { cart: { id: cart.id }, product: { id: productId } },
        });
        if (cartItem) {
            const newQuantity = cartItem.quantity + quantity;
            if (product.stock < newQuantity) {
                throw new common_1.BadRequestException('Not enough stock available');
            }
            cartItem.quantity = newQuantity;
            await this.cartItemRepository.save(cartItem);
        }
        else {
            cartItem = this.cartItemRepository.create({
                cart,
                product,
                quantity,
            });
            await this.cartItemRepository.save(cartItem);
        }
        return this.getCart(userId);
    }
    async updateItem(userId, productId, quantity) {
        const product = await this.productsService.findOne(productId);
        if (product.stock < quantity) {
            throw new common_1.BadRequestException('Not enough stock available');
        }
        const cart = await this.getCart(userId);
        const cartItem = await this.cartItemRepository.findOne({
            where: { cart: { id: cart.id }, product: { id: productId } },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Item not in cart');
        }
        cartItem.quantity = quantity;
        await this.cartItemRepository.save(cartItem);
        return this.getCart(userId);
    }
    async removeItem(userId, productId) {
        const cart = await this.getCart(userId);
        await this.cartItemRepository.delete({ cart: { id: cart.id }, product: { id: productId } });
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.getCart(userId);
        await this.cartItemRepository.delete({ cart: { id: cart.id } });
        return this.getCart(userId);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        products_service_1.ProductsService])
], CartService);
//# sourceMappingURL=cart.service.js.map