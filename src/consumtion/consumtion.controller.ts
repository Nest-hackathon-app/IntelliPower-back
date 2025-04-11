import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ConsumtionService } from './consumtion.service';
import { CreateConsumtionDto } from './dto/create-consumtion.dto';
import { UpdateConsumtionDto } from './dto/update-consumtion.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  GetGroupedDataDto,
  groupBy,
} from 'src/temperature/dto/get-temperature.dto';
import { GetPeriodDataDto } from 'src/temperature/dto/get-temperature-period.dto';
import { currentUser } from 'src/auth/decorators/getUser.decorator';
import { user } from '@prisma/client';
import { GetConsumptionLastDto } from './dto/get-consumtion-last.dto';
import { Roles } from 'src/auth/decorators/userRole.decorator';
import { jwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@UseGuards(jwtGuard, RoleGuard)
@Controller('consumtion')
export class ConsumtionController {
  logger = new Logger(ConsumtionController.name);
  constructor(private readonly consumtionService: ConsumtionService) {}

  @Post()
  create(@Body() createConsumtionDto: CreateConsumtionDto) {
    return this.consumtionService.create(createConsumtionDto);
  }
  @Get('period/:floorId')
  @ApiOperation({ summary: 'Get consumtion entries by Floor not grouped' })
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
  @ApiParam({
    name: 'floorId',
    required: false,
  })
  getEntriesPeriodPerFloor(
    @Param('floorId') floorId: string,
    @Query() query: GetPeriodDataDto,
  ) {
    return this.consumtionService.getEntriesPeriodPerFloor(
      floorId,
      query.startDate,
      query.endDate,
    );
  }
  @Get('period/area/:areaId')
  @ApiOperation({ summary: 'Get consumtion entries by Area not grouped' })
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
  @ApiParam({
    name: 'areaId',
    required: false,
  })
  getEntriesPeriodPerArea(
    @Param('areaId') areaId: string,
    @Query() query: GetPeriodDataDto,
  ) {
    return this.consumtionService.getEntriesByArea(areaId, query);
  }

  @ApiOperation({ summary: 'Get consumtion entries by Area grouped' })
  @ApiQuery({
    name: 'groupBy',
    required: false,
    enum: groupBy,
  })
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
  getEntriesPerPeriod(
    @Query() query: GetPeriodDataDto,
    @Param('areaId') areaId: string,
  ) {
    return this.consumtionService.getEntriesByArea(areaId, query);
  }
  @ApiOperation({ summary: 'Get consumtion entries by Floor grouped' })
  @ApiQuery({
    name: 'groupBy',
    required: false,
    enum: groupBy,
  })
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
  @ApiParam({
    name: 'floorId',
    required: false,
  })
  @Get('floor/:floorId')
  getFloorEntries(
    @Param('floorId') floorId: string,
    @Query() query: GetGroupedDataDto,
  ) {
    return this.consumtionService.getFloorEntries(floorId, query);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConsumtionDto: UpdateConsumtionDto,
  ) {
    return this.consumtionService.update(+id, updateConsumtionDto);
  }
  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.consumtionService.remove(+id);
  }
  @Get('period/area/:areaId')
  @ApiOperation({
    summary: 'Get consumtion entries by Last period of an Area ',
  })
  @ApiParam({
    name: 'areaId',
    required: false,
  })
  @ApiQuery({
    type: GetConsumptionLastDto,
  })
  getLastEntriesPerArea(
    @Param('areaId') areaId: string,
    @Query() data: GetConsumptionLastDto,
  ) {
    return this.consumtionService.getEntriesOfLastPeriodOfArea(areaId, data);
  }
  @Get('period/floor/:floorId')
  @ApiOperation({
    summary: 'Get consumtion entries by Last period of a Floor ',
  })
  @ApiParam({
    name: 'floorId',
    type: String,
    required: true,
  })
  @ApiQuery({
    type: GetConsumptionLastDto,
  })
  getLastEntriesPerFloor(
    @Param('floorId') floorId: string,
    @Query() data: GetConsumptionLastDto,
  ) {
    return this.consumtionService.getEntriesOfLastPeriodOfFloor(floorId, data);
  }
  @Public()
  @ApiOperation({ summary: 'Get Training Data for ml' })
  @Get('ai')
  getMlData() {
    return this.consumtionService.getMlData();
  }

  @Roles('admin')
  @ApiOperation({ summary: 'Delete all the consumtion entries of a company' })
  @Delete('clear')
  clearConsumtionEntries(@currentUser() user: user) {
    return this.consumtionService.clearCompanyConsumtion(user.companyId);
  }

  @Public()
  @MessagePattern('consumtion/entry')
  entry(@Payload() data: CreateConsumtionDto) {
    if (!data) {
      this.logger.error('No data received');
      return;
    }
    if (!data.id) {
      this.logger.error('No sensorId received');

      return;
    }
    if (!data.voltage) {
      this.logger.error('No voltage received');
      return;
    }
    if (!data.power) {
      this.logger.error('No power received');
      return;
    }
    this.logger.log('Adding consumtion entry from sensor ' + data.id);
    this.logger.log('Voltage: ' + data.voltage);
    this.logger.log('Power: ' + data.power);
    return this.consumtionService.create(data);
  }
}
