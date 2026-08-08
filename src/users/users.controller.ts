import { Controller, Get, Post, Param, Body, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/orders')
  async getUserOrders(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID provided');
    }
    const orders = await this.usersService.getOrders(userId);
    return {
      userId,
      count: orders.length,
      orders,
    };
  }

  @Post('login')
  async login(@Body() body: { email: string }) {
    if (!body || !body.email) {
      throw new BadRequestException('Email is required for login');
    }
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      throw new NotFoundException(`User with email "${body.email}" not found.`);
    }
    return {
      message: 'Login successful',
      user,
    };
  }

  @Post()
  async createUser(@Body() body: { name: string; email: string }) {
    if (!body || !body.email || !body.name) {
      throw new BadRequestException('Name and Email are required');
    }
    const user = await this.usersService.create(body.name, body.email);
    return {
      message: 'Account created successfully',
      user,
    };
  }

  @Get('trigger-error')
  async triggerError() {
    console.log('\n[DEMO ERROR TRIGGERED] Throwing unhandled server error for Ravyn SDK exception tracking');
    throw new InternalServerErrorException('Simulated Server Critical Failure — Tracked by Ravyn Telemetry');
  }
}

