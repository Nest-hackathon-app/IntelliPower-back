import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GetTemperatureDto } from './dto/get-temperature.dto';
import { TemperatureService } from './temperature.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('temperature')
export class TemperatureController {
  constructor(private readonly temperatureService: TemperatureService) {}
  @Get()
  getTemperatureEntries(
    @Query() query: GetTemperatureDto,
    @Param('areaId') areaId: string,
  ) {
    return this.temperatureService.getTemperatureData(query, areaId);
  }
  @MessagePattern('temperature/entry')
  addTemperatureEntry(
    @Payload() data: { sensorId: string; temperature: number },
  ) {
    console.log('Received temperature data is cool:', data);
  }
  @Post('alert')
  alertSensor(){
    console.log('Alert Sensor');
    this.temperatureService.alertSensor();
  }
}
