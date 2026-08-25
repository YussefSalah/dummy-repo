import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(query: any) {
    const { page = 1, limit = 1000, category, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.productsRepository.createQueryBuilder('product');

    if (category) {
      qb.andWhere('product.category = :category', { category });
    }

    if (search) {
      qb.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    }

    const [initialItems, total] = await qb
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // N+1 Query: Execute 1 query for product list, then N queries sequentially in a for loop
    const items = [];
    for (const item of initialItems) {
      const detailedProduct = await this.productsRepository.findOneBy({ id: item.id });
      if (detailedProduct) {
        items.push(detailedProduct);
      }
    }

    return {
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
