import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {GetGroupedDataDto, groupBy } from './dto/get-temperature.dto';
import { TemperatureService } from './temperature.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('temperature')
export class TemperatureController {
  logger = new Logger(TemperatureController.name);
  constructor(private readonly temperatureService: TemperatureService) {}
  @ApiOperation({ summary: 'Get temperature entries by floor' })
  @ApiQuery({ name: 'groupBy', required: false, enum: groupBy })
  @ApiQuery({
    name: 'startDate',
    type: Date,
    required: false,
  })
  @ApiQuery({
    name: 'endDate',
    type: Date,
    required: false,
  })
  @Get('floor/:floorId')
  getTemperatureEntriesByFloor(
    @Query() query: GetGroupedDataDto,
    @Param('floorId') floorId: string,
  ) {
    if (!query.groupBy) {
      throw new BadRequestException('GroupBy is required');
    }
    return this.temperatureService.getTemperatureDataByFloor(query, floorId);
  }
  @ApiOperation({ summary: 'Get temperature entries' })
  @ApiQuery({ name: 'groupBy', required: false, enum: groupBy })
  @ApiQuery({
    name: 'startDate',
    type: Date,
    required: false,
  })
  @ApiQuery({
    name: 'endDate',
    type: Date,
    required: false,
  })
  @Get('area/:areaId')
  getTemperatureEntries(
    @Query() query: GetGroupedDataDto,
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
