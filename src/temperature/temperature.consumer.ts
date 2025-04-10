import { MessagePattern, Payload } from '@nestjs/microservices';
import { TemperatureService } from './temperature.service';
import { Injectable } from '@nestjs/common';

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
