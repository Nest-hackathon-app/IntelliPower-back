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
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  GetGroupedDataDto,
  groupBy,
} from 'src/temperature/dto/get-temperature.dto';

@Controller('consumtion')
export class ConsumtionController {
  constructor(private readonly consumtionService: ConsumtionService) {}

  @Post()
  create(@Body() createConsumtionDto: CreateConsumtionDto) {
    return this.consumtionService.create(createConsumtionDto);
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
    @Query() query: GetGroupedDataDto,
    @Param('areaId') areaId: string,
  ) {
    return this.consumtionService.groupEntriesByPeriod(areaId, query);
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
  @MessagePattern('consumtion/entry')
  entry(@Payload() data: CreateConsumtionDto) {
    return this.consumtionService.create(data);
  }
}
