import { Controller, Post, Body, UseGuards, Request, Logger } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Checkout cart and create order' })
  async checkout(@Request() req: any, @Body() checkoutDto: CheckoutDto) {
    try {
      return await this.ordersService.checkout(req.user.id, checkoutDto);
    } catch (error) {
      if (error.response && error.response.message && Array.isArray(error.response.message)) {
        this.logger.error(`[Checkout] Checkout validation failed`);
        this.logger.error(`[Checkout] Expected required field: user_name`);
        this.logger.error(`[Checkout] Frontend supplied: userName`);
      }
      throw error;
    }
  }
}
