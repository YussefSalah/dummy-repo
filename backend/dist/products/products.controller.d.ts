import { ProductsService } from './products.service';
import { DummyProductsService } from './dummy-products.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly dummyProductsService;
    constructor(productsService: ProductsService, dummyProductsService: DummyProductsService);
    findAll(query: any): Promise<{
        items: import("./entities/product.entity").Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
    syncProducts(): Promise<{
        fetched: number;
        created: number;
        updated: number;
        failed: number;
    }>;
}
