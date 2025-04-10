import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { GetTemperatureDto } from './dto/get-temperature.dto';
import { TemperatureService } from './temperature.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('temperature')
export class TemperatureController {
  logger = new Logger(TemperatureController.name);
  constructor(private readonly temperatureService: TemperatureService) {}
  @Get(':areaId')
  getTemperatureEntries(
    @Query() query: GetTemperatureDto,
    @Param('areaId') areaId: string,
  ) {
    console.log(query);
    if (!query.groupBy) {
      throw new BadRequestException('GroupBy is required');
    }
    return this.temperatureService.getTemperatureData(query, areaId);
  }
  @MessagePattern('temperature/entry')
  addTemperatureEntry(
    @Payload() data: { sensorId: string; temperature: number },
  ) {
    if (!data.sensorId || !data.temperature) {
      this.logger.error('Invalid data entry from sensor + ' + data.sensorId);
      return;
    }

    this.logger.log('Adding temperature entry from sensor ' + data.sensorId);

    return this.temperatureService.addTemperatureEntry(
      data.sensorId,
      data.temperature,
    );
  }
  @Post('alert')
  alertSensor() {
    console.log('Alert Sensor');
    this.temperatureService.alertSensor();
  }
}
