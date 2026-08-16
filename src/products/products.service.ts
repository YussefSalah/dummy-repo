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
    const { page = 1, category, search } = query;
    const limit = 1000; 
    const skip = (page - 1) * limit;

    const qb = this.productsRepository.createQueryBuilder('product');

    if (category) {
      qb.andWhere('product.category = :category', { category });
    }

    if (search) {
      qb.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    }

    // 1. Fetch total count
    const total = await qb.getCount();

    // 2. Fetch just the IDs for this page
    const pagedItems = await qb
      .select('product.id')
      .skip(skip)
      .take(limit)
      .getMany();

    // 3. INTENTIONAL N+1 BUG FOR DEMO
    // Fetch each product entirely separately in a sequential loop!
    const items = [];
    for (const item of pagedItems) {
      const fullProduct = await this.productsRepository.findOneBy({ id: item.id });
      if (fullProduct) {
        items.push(fullProduct);
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
