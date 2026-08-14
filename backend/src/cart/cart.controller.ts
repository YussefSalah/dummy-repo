import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(@Request() req: any, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addItem(req.user.id, addToCartDto.productId, addToCartDto.quantity);
  }

  @Patch('items/:productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItem(@Request() req: any, @Param('productId') productId: string, @Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartService.updateItem(req.user.id, productId, updateCartItemDto.quantity);
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(@Request() req: any, @Param('productId') productId: string) {
    return this.cartService.removeItem(req.user.id, productId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  clearCart(@Request() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}
