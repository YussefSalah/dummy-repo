import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { DummyProductsService } from './dummy-products.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly dummyProductsService: DummyProductsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sync products from dummy API' })
  syncProducts() {
    return this.dummyProductsService.syncProducts();
  }
}
