import { Controller, Get, Query } from '@nestjs/common';

@Controller('api/cart')
export class CartController {
  @Get('total')
  getTotal(@Query('data') data?: string) {
    console.log('\n[LOGIC ERROR TRIGGERED] Calculating cart total...');
    const rawData = data || '{ "items": [10, 20, 30] '; 
    
    // BUG: Will throw SyntaxError if rawData is malformed JSON, and there's no try/catch
    const parsed = JSON.parse(rawData);
    
    // BUG: Off-by-one logic error (i < length - 1)
    let total = 0;
    for (let i = 0; i < parsed.items.length - 1; i++) {
      total += parsed.items[i];
    }
    
    return { total };
  }
}
