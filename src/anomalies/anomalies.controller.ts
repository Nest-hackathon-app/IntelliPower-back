
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AnomaliesService } from './anomalies.service';
import { createAnomalyDto } from './dto/create-anomaly.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { jwtGuard } from 'src/auth/guards/jwt.guard';
import { currentUser } from 'src/auth/decorators/getUser.decorator';
import { user } from '@prisma/client';

@UseGuards(jwtGuard)
@ApiTags('Anomalies')
@Controller('anomalies')
export class AnomaliesController {
  constructor(private readonly anomaliesService: AnomaliesService) {}

  @Get('company')
  @ApiOperation({ summary: 'Get all anomalies by company ID' })
  @ApiResponse({
    status: 200,
    description: 'List of anomalies',
  })
  @ApiParam({ name: 'companyId', type: String, description: 'Company ID' })
  getAnomaliesByCompanyId(@currentUser() user: user) {
    return this.anomaliesService.getAnomaliesOfCompany(user.companyId);
  }

  @Get('area/:areaId')
  @ApiOperation({ summary: 'Get all anomalies by area ID' })
  @ApiResponse({
    status: 200,
    description: 'List of anomalies in the area',
  })
  @ApiParam({ name: 'areaId', type: String, description: 'Area ID' })
  async getAnomaliesByAreaId(@Param('areaId') areaId: string) {
    return this.anomaliesService.getAnomaliesByAreaId(areaId);
  }

  @Get('floor/:floorId')
  @ApiOperation({ summary: 'Get all anomalies by floor ID' })
  @ApiResponse({
    status: 200,
    description: 'List of anomalies in the floor',
  })
  @ApiParam({ name: 'floorId', type: String, description: 'Floor ID' })
  async getAnomaliesByFloorId(@Param('floorId') floorId: string) {
    return this.anomaliesService.getAnomaliesByFloorId(floorId);
  }

  @Post()
  @ApiOperation({ summary: 'Report a new anomaly' })
  @ApiResponse({
    status: 201,
    description: 'Anomaly successfully reported',
  })
  async reportAnomaly(@Body() createAnomalyDto: createAnomalyDto) {
    return this.anomaliesService.reportAnomaly(createAnomalyDto);
  }

  @Post('resolved/:anomalyId')
  @ApiOperation({ summary: 'Report an anomaly as resolved' })
  @ApiResponse({
    status: 200,
    description: 'Anomaly marked as resolved',
  })
  @ApiParam({ name: 'anomalyId', type: String, description: 'Anomaly ID' })
  async reportAnomalyResolved(@Param('anomalyId') anomalyId: string) {
    return this.anomaliesService.reportAnomalyResolved(anomalyId);
  }
}

