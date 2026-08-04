import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CheckoutModule } from './checkout/checkout.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    ProductsModule,
    CheckoutModule,
    CartModule,
  ],
})
export class AppModule {}
