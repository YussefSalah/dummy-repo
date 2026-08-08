import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/boom')
  triggerAlert() {
    throw new Error("TEST: System Failure Initialized!");
  }

  @Get('/boom/:id')
  triggerAlertMany(@Param('id') id: string) {
    throw new Error(`TEST: System Failure Initialized! (Variant ${id})`);
  }
}
