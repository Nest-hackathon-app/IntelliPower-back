import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConsumtionDto } from './dto/create-consumtion.dto';
import { UpdateConsumtionDto } from './dto/update-consumtion.dto';
import { PrismaService } from 'src/db/prisma.service';
import { groupByDate } from 'src/utils/group-data.util';
import { GetGroupedDataDto } from 'src/temperature/dto/get-temperature.dto';
import { GetPeriodDataDto } from 'src/temperature/dto/get-temperature-period.dto';
import { GetConsumptionLastDto } from './dto/get-consumtion-last.dto';
import { FloorResponseDto } from 'src/floor-plan/dto/floor-response.dto';
@Injectable()
export class ConsumtionService {
  constructor(private readonly prisma: PrismaService) {}
  async getEntriesOfLastPeriodOfArea(
    areaId: string,
    data: GetConsumptionLastDto,
  ) {
    const now = new Date();
    const fallBackDate = new Date();
    switch (data.type) {
      case 'DAY':
        fallBackDate.setDate(now.getDate() - 1);
        break;
      case 'WEEK':
        fallBackDate.setDate(now.getDate() - 7);
        break;
      case 'MONTH':
        fallBackDate.setMonth(now.getMonth() - 1);
    }
    return this.prisma.electricity.findMany({
      where: {
        AND: {
          sensor: {
            areaId,
          },
          createdAt: {
            gte: fallBackDate,
            lte: now,
          },
        },
      },
    });
  }
  async getEntriesOfLastPeriodOfFloor(
    floorId: string,
    data: GetConsumptionLastDto,
  ) {
    console.log(floorId);
    const now = new Date();
    const fallBackDate = new Date();
    switch (data.type) {
      case 'DAY':
        fallBackDate.setDate(now.getDate() - 1);
        break;
      case 'WEEK':
        fallBackDate.setDate(now.getDate() - 7);
        break;
      case 'MONTH':
        fallBackDate.setMonth(now.getMonth() - 1);
    }
    const floor = await this.prisma.floor.findUnique({
      where: {
        id: floorId,
      },
      select: {
        id: true,
        areas: {
          select: {
            id: true,
          },
        },
      },
    });
    console.log(floor);
    if (!floor) {
      throw new NotFoundException('Floor not found');
    }
    return this.prisma.electricity.findMany({
      where: {
        AND: {
          sensor: {
            areaId: {
              in: floor.areas.map((area) => area.id),
            },
          },
          createdAt: {
            gte: fallBackDate,
            lte: now,
          },
        },
      },
    });
  }
  async getFloorEntries(floorId: string, query: GetGroupedDataDto) {
    const { startDate, endDate, groupBy } = query;
    const res = await this.prisma.electricity.findMany({
      where: {
        sensor: {
          area: { floorId },
        },
        createdAt: {
          lte: endDate,
          gte: startDate,
        },
      },
    });
    const groupedData = groupByDate(res, groupBy, 'voltage');
    return groupedData;
  }

  create(createConsumtionDto: CreateConsumtionDto) {
    return this.prisma.electricity.create({
      data: {
        voltage: createConsumtionDto.voltage,
        sensorId: createConsumtionDto.id,
        power: createConsumtionDto.power,
      },
    });
  }

  async getEntriesByArea(areaId: string, query: GetPeriodDataDto) {
    return this.prisma.electricity.findMany({
      where: {
        sensor: {
          areaId,
        },
        createdAt: {
          lte: query.endDate,
          gte: query.startDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
  async groupEntriesByPeriod(areaId: string, query: GetGroupedDataDto) {
    const { startDate, endDate, groupBy } = query;
    const consumtion = await this.prisma.electricity.findMany({
      where: {
        sensor: {
          areaId,
        },
        createdAt: {
          lte: endDate,
          gte: startDate,
        },
      },
    });
    return groupByDate(consumtion, groupBy, 'voltage');
  }
  getEntriesPeriodPerFloor(floorId: string, startDate: Date, endDate: Date) {
    return this.prisma.electricity.findMany({
      where: {
        sensor: {
          area: { floorId },
        },
        createdAt: {
          lte: endDate,
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
  getMlData() {
    return this.prisma.electricity.findMany({
      include: {
        sensor: {
          include: {
            area: {
              include: {
                floor: {
                  include: {
                    company: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
  findAll() {
    return `This action returns all consumtion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} consumtion`;
  }

  update(id: number, updateConsumtionDto: UpdateConsumtionDto) {
    return `This action updates a #${id} consumtion`;
  }

  remove(id: number) {
    return `This action removes a #${id} consumtion`;
  }

  clearCompanyConsumtion(companyId: string) {
    return this.prisma.electricity.deleteMany({
      where: {
        sensor: {
          area: {
            floor: {
              companyId,
            },
          },
        },
      },
    });
  }
}
