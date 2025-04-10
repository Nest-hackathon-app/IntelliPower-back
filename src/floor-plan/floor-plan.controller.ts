import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FloorPlanService } from './floor-plan.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateFloorDto } from './dto/create-floor.dto';
import { AreaResponseDto } from './dto/floor-response.dto';
import { Roles } from 'src/auth/decorators/userRole.decorator';
import { jwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';

@Controller('floor-plan')
@UseGuards(jwtGuard, RoleGuard)
export class FloorPlanController {
  constructor(private readonly floorService: FloorPlanService) {}
  @ApiOperation({ summary: 'Get company Floors' })
  @Get(':companyId')
  async getCompanyFloorPlans(@Param('companyId') companyId: string) {
    return this.floorService.getCompanyFloorPlans(companyId);
  }
  @Roles('admin')
  @ApiOperation({ summary: 'Add Floor to company' })
  @Post(':companyId')
  addFloorToCompany(
    @Body() data: CreateFloorDto,
    @Param('companyId') companyId: string,
  ) {
    return this.floorService.addFloorToCompany(data, companyId);
  }
  @ApiOperation({ summary: 'Get Floor Areas' })
  @ApiParam({ name: 'floorId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Floor Areas',
    type: Array<AreaResponseDto>,
  })
  @Get('areas/:floorId')
  getFloorAreas(@Param('floorId') floorId: string) {
    return this.floorService.getFloorAreas(floorId);
  }
}
