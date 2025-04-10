import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import {  GetGroupedDataDto, GROUPBY } from './dto/get-temperature.dto';
import { ClientProxy } from '@nestjs/microservices';
import { groupByDate } from 'src/utils/group-data.util';

// Define a type for the grouped data
export interface GroupedData<T> {
  content: T[];
  sum: number;
  count: number;
}

@Injectable()
export class TemperatureService {
  async getTemperatureDataByFloor(query: GetGroupedDataDto, floorId: string) {
    const { startDate, endDate, groupBy } = query;
    const temperature = await this.prisma.temperature.findMany({
      where: {
        area: {
          floorId,
        },
        createdAt: {
          lte: endDate,
          gte: startDate,
        },
      },
    });
    return groupByDate(temperature, groupBy, 'temp');
  }
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ALERT_SERVICE') private readonly alertService: ClientProxy,
  ) {}

  alertSensor() {
    this.alertService.emit('alert', {
      message: 'fire_alert',
    });
  }

  async addTemperatureEntry(sensorId: string, temperature: number) {
    const room = await this.prisma.sensor.findUnique({
      where: { id: sensorId },
      select: { area: { select: { id: true } } },
    });
    if (!room) {
      throw new Error('Room not found , sensorId: ' + sensorId);
    }
    const areaId = room.area.id;
    return this.prisma.temperature.create({
      data: {
        temp: temperature,
        areaId,
      },
    });
  }
  async getTemperatureData(query: GetGroupedDataDto, areaId: string) {
    const { startDate, endDate, groupBy } = query;
    const temperature = await this.prisma.temperature.findMany({
      where: {
        areaId,
        createdAt: {
          lte: endDate,
          gte: startDate,
        },
      },
    });
    const groupedData = groupByDate(temperature, groupBy, 'temp');

    return groupedData;
  }

  // This function groups temperatures by day, week, or month and returns the averages
}
