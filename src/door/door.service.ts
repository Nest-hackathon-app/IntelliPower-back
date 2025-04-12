import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from 'src/db/prisma.service';
import { MQTT_PUBLISHER } from 'src/utils/constants';
const doorAction = {
  OPEN: 'open',
  CLOSE: 'close',
} as const;

type doorAction = (typeof doorAction)[keyof typeof doorAction];
@Injectable()
export class DoorService {
  constructor(
    @Inject(MQTT_PUBLISHER) private readonly pub: ClientProxy,
    private readonly prisma: PrismaService,
  ) {}
  sendDoorSignal(doorId: string, action: doorAction) {
    this.pub.emit('servo/control', {
      doorId,
      action,
    });
    return 'Door control signal sent';
  }
  async openDoor(doorId: string) {
    console.log('Opening door:', doorId);
    await this.prisma.door.update({
      where: {
        id: doorId,
      },
      data: {
        status: 'open',
      },
    });
    this.sendDoorSignal(doorId, doorAction.OPEN);
  }
  async closeDoor(doorId: string) {
    console.log('Opening door:', doorId);

    await this.prisma.door.update({
      where: {
        id: doorId,
      },
      data: {
        status: 'closed',
      },
    });
    this.sendDoorSignal(doorId, doorAction.CLOSE);
  }

  async getFloorDoors(floorId: string) {
    const res = await this.prisma.door.findMany({
      where: {
        area: {
          floorId,
        },
      },
    });
    return res;
  }
}
