import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from 'src/db/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { MQTT_PUBLISHER } from 'src/utils/constants';
const doorAction = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
} as const;

type doorAction = (typeof doorAction)[keyof typeof doorAction];
@Injectable()
export class DoorService {
  constructor(
    @Inject(MQTT_PUBLISHER) private readonly pub: ClientProxy,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationsService,
  ) {}
  sendDoorSignal(doorId: string, action: doorAction) {
    this.pub.emit('servo/control', action);
    return 'Door control signal sent';
  }
  async openDoor(doorId: string, companyId:string,userId: string) {
    console.log('Opening door:', doorId);
    this.notificationService.addNotification(userId, {
      type: 'SYSTEM_ALERT',
      title: 'Door Opened',
      message: 'Door opened successfully By '+userId,
      roles: ['admin'],
      priority: 'low',
    });
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
