import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FloorPlanService } from './floor-plan.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateFloorDto } from './dto/create-floor.dto';
import { AreaResponseDto } from './dto/floor-response.dto';
import { Roles } from 'src/auth/decorators/userRole.decorator';
import { jwtGuard } from 'src/auth/guards/jwt.guard';
import { currentUser } from 'src/auth/decorators/getUser.decorator';
import { user } from '@prisma/client';
import { ExpressAdapter, FileInterceptor } from '@nestjs/platform-express';

@UseGuards(jwtGuard)
@Controller('floor-plan')
export class FloorPlanController {
  constructor(private readonly floorService: FloorPlanService) {}
  @ApiOperation({ summary: 'Get company Floors and their areas' })
  @ApiBearerAuth()
  @Get()
  async getCompanyFloorPlans(@currentUser() usr: user) {
    return this.floorService.getCompanyFloorPlans(usr.companyId);
  }

  @Roles('admin')
  @ApiOperation({ summary: 'Add Floor to company' })
  @Post()
  addFloorToCompany(@Body() data: CreateFloorDto, @currentUser() usr: user) {
    return this.floorService.addFloorToCompany(data, usr.companyId);
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
  @Get('area/:areaId')
  getArea(@Param('areaId') areaId: string) {
    return this.floorService.getArea(areaId);
  }
  @Roles('admin')
  @UseInterceptors(FileInterceptor('plan'))
  @Patch('plan/:floorId')
  @ApiOperation({ summary: 'Upload Floor Plan' })
  @ApiParam({ name: 'floorId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Floor Plan',
  })
  getFloorPlan(@UploadedFile() file: Express.Multer.File) {
    return this.floorService.getFloorPlan(file);
  }
}
