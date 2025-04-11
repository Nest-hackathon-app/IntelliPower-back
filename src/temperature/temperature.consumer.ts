import { MessagePattern, Payload } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { TemperatureService } from './temperature.service';

@Injectable()
export class TemperatureConsumer {
  constructor(private readonly tempratureService: TemperatureService) {}
  @MessagePattern('temperature/entry')
  addTemperatureEntry(
    @Payload() data: { sensorId: string; temperature: number },
  ) {
    console.log('Received temperature data:', data);
    // const { sensorId, temperature } = data;
    // return this.tempratureService.addTemperatureEntry(sensorId, temperature);
  }
}
