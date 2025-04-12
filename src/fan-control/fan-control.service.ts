import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FanSpeed, FanStatus } from '@prisma/client';
import { jwtGuard } from 'src/auth/guards/jwt.guard';
import { PrismaService } from 'src/db/prisma.service';
import { MQTT_PUBLISHER } from 'src/utils/constants';
@UseGuards(jwtGuard)
@Injectable()
export class FanControlService {
  constructor(
    @Inject(MQTT_PUBLISHER) private readonly pub: ClientProxy,
    private readonly prisma: PrismaService,
  ) {}
  sendFanSignal(fanId: string, action: object) {
    this.pub.emit('fan-control', {
      fanId,
      action,
    });
    return 'Fan control signal sent';
  }
  async changeFanSpeed(fanId: string, speed: FanSpeed) {
    this.sendFanSignal(fanId, { cmd: 'changeSpeed', speed });
    const fan = await this.prisma.fan.update({
      where: {
        id: fanId,
      },
      data: {
        speed: speed,
      },
    });
    return fan;
  }
  async changeFanState(fanId: string, state: FanStatus) {
    this.sendFanSignal(fanId, { cmd: 'changeState', state });
    const fan = await this.prisma.fan.update({
      where: {
        id: fanId,
      },
      data: {
        status: state,
      },
    });
    return fan;
  }
  async getFloorFans(floorId: string) {
    const res = await this.prisma.fan.findMany({
      where: {
        area: {
          floorId,
        },
      },
      include: {
        area: {
          include: {
            sensor: {
              where: {
                type: 'TEMPERATURE',
              },
              include: {
                Temperature: {
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
    //Get the temperature of the first sensor of each fan
    const recentTemps: number[] = [];
    for (const fan of res) {
      const sensors = fan.area.sensor;
      for (const sensor of sensors) {
        const recentTemp = sensor.Temperature[0];
        if (recentTemp) {
          recentTemps.push(recentTemp.temp);
        }
      }
    }
    return res.map((fan, idx) => {
      return {
        fan,
        temperature: recentTemps[idx] ?? null,
      };
    });
  }
}
