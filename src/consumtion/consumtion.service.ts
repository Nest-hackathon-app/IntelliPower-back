import { Injectable } from '@nestjs/common';
import { CreateConsumtionDto } from './dto/create-consumtion.dto';
import { UpdateConsumtionDto } from './dto/update-consumtion.dto';
import { PrismaService } from 'src/db/prisma.service';
import { groupByDate } from 'src/utils/group-data.util';
import { GetGroupedDataDto } from 'src/temperature/dto/get-temperature.dto';

@Injectable()
export class ConsumtionService {
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
  constructor(private readonly prisma: PrismaService) {}
  create(createConsumtionDto: CreateConsumtionDto) {
    return this.prisma.electricity.create({
      data: {
        voltage: createConsumtionDto.voltage,
        sensorId: createConsumtionDto.id,
        power: createConsumtionDto.power,
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
}
