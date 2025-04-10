import { Injectable } from '@nestjs/common';
import { NotificationsSseService } from './notifications-sse.service';
import { PrismaService } from 'src/db/prisma.service';
import { createNotificationDto } from './dto/notification.dto';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly sseService: NotificationsSseService,
    private readonly prisma: PrismaService,
  ) {}

  addNotification(userId: string, notification: createNotificationDto) {
    const noty = this.prisma.notification.create({
      data: {
        ...notification,
        userId,
      },
    });
    this.sseService.sendToClient(userId, {
      data: notification,
      type: 'Notification',
    });
  }

  getNotifications(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
    });
  }

  clearNotification(userId: string, notificationId: string) {
    return this.prisma.notification.delete({
      where: {
        id: notificationId,
        userId,
      },
    });
  }
}
