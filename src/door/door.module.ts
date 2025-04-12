import { Module } from '@nestjs/common';
import { DoorService } from './door.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports:[NotificationsModule],
  providers: [DoorService],
  exports: [DoorService],
})
export class DoorModule {}
