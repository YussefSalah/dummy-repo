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
var DummyProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyProductsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
let DummyProductsService = DummyProductsService_1 = class DummyProductsService {
    configService;
    productsRepository;
    logger = new common_1.Logger(DummyProductsService_1.name);
    constructor(configService, productsRepository) {
        this.configService = configService;
        this.productsRepository = productsRepository;
    }
    async syncProducts() {
        this.logger.log('Product synchronization started');
        const apiUrl = this.configService.get('DUMMY_PRODUCTS_API_URL') || 'https://dummyjson.com/products';
        let stats = { fetched: 0, created: 0, updated: 0, failed: 0 };
        try {
            const response = await fetch(`${apiUrl}?limit=0`);
            if (!response.ok)
                throw new Error(`API returned ${response.status}`);
            const data = await response.json();
            const products = data.products || [];
            stats.fetched = products.length;
            for (const item of products) {
                try {
                    const existing = await this.productsRepository.findOne({ where: { externalId: item.id } });
                    if (existing) {
                        await this.productsRepository.update(existing.id, {
                            name: item.title,
                            description: item.description,
                            price: item.price.toString(),
                            imageUrl: item.thumbnail,
                            stock: item.stock,
                            category: item.category,
                        });
                        stats.updated++;
                    }
                    else {
                        const product = this.productsRepository.create({
                            externalId: item.id,
                            name: item.title,
                            slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + item.id,
                            description: item.description,
                            price: item.price.toString(),
                            imageUrl: item.thumbnail,
                            stock: item.stock,
                            category: item.category,
                        });
                        await this.productsRepository.save(product);
                        stats.created++;
                    }
                }
                catch (error) {
                    this.logger.error(`Failed to process product ${item.id}`, error.stack);
                    stats.failed++;
                }
            }
            this.logger.log('Product synchronization completed');
            return stats;
        }
        catch (error) {
            this.logger.error('Product synchronization failed', error.stack);
            throw error;
        }
    }
};
exports.DummyProductsService = DummyProductsService;
exports.DummyProductsService = DummyProductsService = DummyProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository])
], DummyProductsService);
//# sourceMappingURL=dummy-products.service.js.map