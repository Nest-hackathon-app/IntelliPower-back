import { Injectable, Logger } from '@nestjs/common';
import { NotificationsSseService } from './notifications-sse.service';
import { PrismaService } from 'src/db/prisma.service';
import { createNotificationDto } from './dto/notification.dto';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  logger = new Logger(NotificationsService.name);
  constructor(
    private readonly sseService: NotificationsSseService,
    private readonly prisma: PrismaService,
  ) {}

  addNotification(companyId: string, notification: createNotificationDto) {

    // const noty = await this.prisma.notification.create({
    //   data: {
    //     ...notification,
    //     users: {
    //       connect: { id: userId },
    //     },
    //   },
    // });
    this.sseService.sendToClient('5', {
      data: notification.title,
      type: 'Notification',
    });
  }

  getNotifications(userId: string): Promise<Notification[]> {
    this.logger.log('Fetching notifications for user:', userId);
    return this.prisma.notification.findMany({
      where: { users: { some: { id: userId } } },
    });
  }

  clearNotification(userId: string, notificationId: string) {
    return this.prisma.notification.delete({
      where: {
        id: notificationId,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
  }
}
