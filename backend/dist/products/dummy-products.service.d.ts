import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
export declare class DummyProductsService {
    private configService;
    private productsRepository;
    private readonly logger;
    constructor(configService: ConfigService, productsRepository: Repository<Product>);
    syncProducts(): Promise<{
        fetched: number;
        created: number;
        updated: number;
        failed: number;
    }>;
}
