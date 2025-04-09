import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateFloorDto } from './dto/create-floor.dto';

@Injectable()
export class FloorPlanService {
  constructor(private readonly prisma: PrismaService) {}
  async getCompanyFloorPlans(companyId: string) {
    return this.prisma.floor.findMany({
      where: { companyId },
      orderBy: { order: 'asc' },
    });
  }
  async addFloorToCompany(data: CreateFloorDto, companyId: string) {
    // Check if the floor already exists for the companyId
    const existingFloor = await this.prisma.floor.findFirst({
      where: {
        companyId,
        name: data.name,
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
  async getFloorAreas(floorId: string) {
    return this.prisma.floor.findUnique({
      where: { id: floorId },
      include: {
        areas: true,
      },
    });
  }
}
