import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetGroupedDataDto, groupBy } from './dto/get-temperature.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
} from '@nestjs/swagger';
import { GetPeriodDataDto } from './dto/get-temperature-period.dto';
import { TemperatureService } from './temperature.service';
import { GetConsumptionLastDto } from 'src/consumtion/dto/get-consumtion-last.dto';
import { currentUser } from 'src/auth/decorators/getUser.decorator';
import { user } from '@prisma/client';
import { Roles } from 'src/auth/decorators/userRole.decorator';
import { jwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@UseGuards(jwtGuard, RoleGuard)
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

  @Public()
  @MessagePattern('temperature/entry')
  addTemperatureEntry(
    @Payload()
    data: {
      sensorId: string;
      temperature: number;
      humidity: number;
    },
  ) {
    if (!data.sensorId || !data.temperature) {
      this.logger.error('Invalid data entry from sensor + ' + data.sensorId);
      return;
    }

    this.logger.log('Adding temperature entry from sensor ' + data.sensorId);

    this.logger.log('Temperature: ' + data.temperature);
    this.logger.log('Humidity: ' + data.humidity);
    return this.temperatureService.addTemperatureEntry(
      data.sensorId,
      data.temperature,
      data.humidity,
    );
  }
  @Post('alert')
  alertSensor() {
    console.log('Alert Sensor');
    this.temperatureService.alertSensor();
  }
  @ApiOperation({ summary: 'Get temperature entries per floor last Period' })
  @ApiQuery({
    enum: ['DAY', 'WEEK', 'MONTH'],
  })
  @Roles('admin')
  @ApiParam({ name: 'floorId', type: 'string' })
  @Get('period/floor/:floorId')
  getTemperatureEntriesPerFloor(
    @Param('floorId') floorId: string,
    @Query() query: GetConsumptionLastDto,
  ) {
    return this.temperatureService.getTemperatureEntriesByLastPeridoFloor(
      floorId,
      query,
    );
  }
  @ApiOperation({ summary: 'Get temperature entries per area last Period' })
  @ApiQuery({
    enum: ['DAY', 'WEEK', 'MONTH'],
  })
  @Roles('admin')
  @ApiParam({ name: 'areaId', type: 'string' })
  @Get('period/area/:areaId')
  getTemperatureEntriesPerArea(
    @Param('areaId') areaId: string,
    @Query() query: GetConsumptionLastDto,
  ) {
    return this.temperatureService.getTemperatureEntriesByLastPeriodArea(
      areaId,
      query,
    );
  }
  @Public()
  @ApiOperation({ summary: 'Get temperature entries for the model to train' })
  @Get('model')
  getTemperatureEntriesForModel() {
    return this.temperatureService.getDataForMl();
  }
  @Roles('admin')
  @ApiOperation({ summary: 'Clear all company temperature entries' })
  @Delete('clear')
  clearTemperatureEntries(@currentUser() user: user) {
    return this.temperatureService.clearTemperatureEntries(user.companyId);
  }
}
