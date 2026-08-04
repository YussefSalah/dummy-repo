import { Controller, Get, Post, Param, Body, Next, Res } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/orders')
  async getUserOrders(@Param('id') id: string) {
    return this.usersService.getOrders(parseInt(id, 10));
  }

  @Post()
  async createUser(@Body() body: { name: string; email: string }, @Res() res: any, @Next() next: any) {
    try {
      // BUG: Postgres unique constraint violation
      const result = await this.usersService.create(body.name, body.email);
      return res.json(result);
    } catch (err) {
      next(err); // Pass to global error handler
    }
  }
}
