import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsSseService } from './notifications-sse.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { createNotificationDto } from './dto/notification.dto';
import { Notification, user } from '@prisma/client';
import { jwtGuard } from 'src/auth/guards/jwt.guard';
import { currentUser } from 'src/auth/decorators/getUser.decorator';
import { Observable } from 'rxjs';
import { Public } from 'src/auth/decorators/public.decorator';

@UseGuards(jwtGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly sseServices: NotificationsSseService,
  ) {}
  @ApiOperation({ summary: 'Get notifications stream' })
  @ApiResponse({
    status: 200,
    description: 'Notifications stream',
    type: Observable<Notification>,
  })
  @Public()
  @Sse()
  getNotifications() {
    const stream = this.sseServices.getStream('5');
    return stream;
  }

  @Post(':userId')
  sendNotification(
    @Param('userId') userId: string,
    @Body() data: Notification,
  ) {
    return this.notificationsService.addNotification(userId, data);
  }
  @Get('/me')
  @ApiOperation({ summary: 'Get all notifications for the logged user ' })
  @ApiResponse({
    status: 200,
    description: 'List of notifications for the user',
  })
  @ApiParam({ name: 'userId', type: String, description: 'User ID' })
  async getNoty(@currentUser() user: user) {
    return this.notificationsService.getNotifications(user.id);
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Add a new notification for a specific user' })
  @ApiResponse({
    status: 201,
    description: 'Notification successfully created and sent',
  })
  @ApiParam({ name: 'userId', type: String, description: 'User ID' })
  addNotification(
    @Param('userId') userId: string,
    @Body() createNotificationDto: createNotificationDto,
  ) {
    return this.notificationsService.addNotification(
      userId,
      createNotificationDto,
    );
  }

  @Delete(':notificationId')
  @ApiOperation({ summary: 'Delete a specific notification for a user' })
  @ApiResponse({
    status: 200,
    description: 'Notification successfully deleted',
  })
  @ApiParam({ name: 'userId', type: String, description: 'User ID' })
  @ApiParam({
    name: 'notificationId',
    type: String,
    description: 'Notification ID',
  })
  async clearNotification(
    @currentUser() user: user,
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationsService.clearNotification(user.id, notificationId);
  }
}
