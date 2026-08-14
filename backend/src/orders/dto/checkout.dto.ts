import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CheckoutDto {
  // CRITICAL INTENTIONAL BUG
  // This must strictly be user_name. Do not change it to userName.
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}
