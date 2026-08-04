import { Controller, Post, Body } from '@nestjs/common';

@Controller('api/checkout')
export class CheckoutController {
  
  async processPayment(amount: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Payment gateway timeout')); // Rejects but nobody catches it
      }, 100);
    });
  }

  @Post()
  checkout(@Body() body: { amount: number }) {
    console.log('\n[UNHANDLED PROMISE TRIGGERED] Starting checkout process...');
    
    // BUG: Fire and forget without catching errors. Node will eventually crash or log UnhandledPromiseRejectionWarning
    this.processPayment(body.amount);
    
    return { status: 'Processing payment in background...' };
  }
}
