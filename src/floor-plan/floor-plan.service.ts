import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { AreaResponseDto, FloorResponseDto } from './dto/floor-response.dto';

@Injectable()
export class FloorPlanService {
  constructor(private readonly prisma: PrismaService) {}
  async getCompanyFloorPlans(companyId: string) {
    return this.prisma.floor.findMany({
      where: { companyId },
      orderBy: { order: 'asc' },
      select: {
        name: true,
        id: true,
        areas: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
  }
  async addFloorToCompany(
    data: CreateFloorDto,
    companyId: string,
  ): Promise<FloorResponseDto> {
    // Check if the floor already exists for the companyId

    const existingFloor = await this.prisma.floor.findFirst({
      where: {
        order: data.order,
      },
    });
    //if it does exist increment the all the above its order by 1
    if (existingFloor) {
      await this.prisma.floor.updateMany({
        where: {
          companyId,
          order: { gte: existingFloor.order },
        },
        data: {
          order: { increment: 1 },
        },
      });
    }
    //Else create the new floor
    return this.prisma.floor.create({
      data: {
        ...data,
        company: { connect: { id: companyId } },
      },
    });
  }
  async getFloorAreas(floorId: string): Promise<AreaResponseDto[] | undefined> {
    const floorArease = await this.prisma.floor.findUnique({
      where: { id: floorId },
      select: {
        areas: true,
      },
    });
    return floorArease?.areas;
  }
  async getArea(areaId: string) {
    return this.prisma.area.findUnique({
      where: { id: areaId },
      include: {
        cameras: true,
        sensor: true,
      },
    });
  }
}
