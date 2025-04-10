import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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

@Controller('consumtion')
export class ConsumtionController {
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
  @Delete(':id')
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
    required: false,
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
  @MessagePattern('consumtion/entry')
  entry(@Payload() data: CreateConsumtionDto) {
    return this.consumtionService.create(data);
  }
}
