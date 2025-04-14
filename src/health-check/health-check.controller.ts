import { Controller } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('health-check')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}
  @MessagePattern('health-check')
  handleHealthCheckSignal(data: any) {
    console.log('Received health check signal:', data);
    this.healthCheckService.sendHealthCheckSignal();
  }
}
