import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  getSystemStatus() {
    return {
      system: 'Blueberry HMS',
      status: 'Online',
      message: 'Backend is successfully communicating with Frontend!',
      timestamp: new Date().toISOString(),
    };
  }
}