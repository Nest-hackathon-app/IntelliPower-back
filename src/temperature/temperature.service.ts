import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { GetTemperatureDto, GROUPBY } from './dto/get-temperature.dto';
import { Temperature } from '@prisma/client';
import { ClientProxy } from '@nestjs/microservices';

// Define a type for the grouped data
interface GroupedTemperatureData {
  temperatures: Temperature[];
  sum: number;
  count: number;
}

@Injectable()
export class TemperatureService {
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
      throw new Error('Room not found');
    }
    const areaId = room.area.id;
    return this.prisma.temperature.create({
      data: {
        temp: temperature,
        areaId,
      },
    });
  }
  async getTemperatureData(query: GetTemperatureDto, areaId: string) {
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
    const groupedData = this.groupByDate(temperature, groupBy);
    return groupedData;
  }

  // This function groups temperatures by day, week, or month and returns the averages
  groupByDate(temperature: Temperature[], groupBy: GROUPBY) {
    const grouped = temperature.reduce<Record<string, GroupedTemperatureData>>(
      (acc, curr) => {
        const date = new Date(curr.createdAt);
        let key: string;

        switch (groupBy) {
          case 'day':
            key = date.toISOString().split('T')[0];
            break;
          case 'week': {
            const weekStart = new Date(
              date.setDate(date.getDate() - date.getDay()),
            );
            key = weekStart.toISOString().split('T')[0];
            break;
          }
          case 'month': {
            const month = new Date(date.getFullYear(), date.getMonth());
            key = month.toISOString().split('T')[0];
            break;
          }
          default:
            key = '';
        }

        if (!acc[key]) {
          acc[key] = { temperatures: [], sum: 0, count: 0 };
        }

        // Accumulate sum and count
        acc[key].temperatures.push(curr);
        acc[key].sum += curr.temp;
        acc[key].count++;

        return acc;
      },
      {}, // Initialize as an empty object
    );

    // Now calculate the averages for each group and return
    const result = Object.keys(grouped).map((key) => {
      const group = grouped[key];
      const average = group.sum / group.count;
      return { key, average, temperatures: group.temperatures };
    });

    return result;
  }
}
