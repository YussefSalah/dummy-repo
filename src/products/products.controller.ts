import { Controller, Get, Next, Res } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('featured')
  async getFeatured(@Res() res: any, @Next() next: any) {
    try {
      const product = await this.productsService.getFeatured();
      return res.json(product);
    } catch (err) {
      next(err);
    }
  }
}
