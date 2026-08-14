import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class DummyProductsService {
  private readonly logger = new Logger(DummyProductsService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async syncProducts() {
    this.logger.log('Product synchronization started');
    const apiUrl = this.configService.get<string>('DUMMY_PRODUCTS_API_URL') || 'https://dummyjson.com/products';

    let stats = { fetched: 0, created: 0, updated: 0, failed: 0 };

    try {
      const response = await fetch(`${apiUrl}?limit=0`);
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      
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
          } else {
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
        } catch (error) {
          this.logger.error(`Failed to process product ${item.id}`, error.stack);
          stats.failed++;
        }
      }

      this.logger.log('Product synchronization completed');
      return stats;
    } catch (error) {
      this.logger.error('Product synchronization failed', error.stack);
      throw error;
    }
  }
}
