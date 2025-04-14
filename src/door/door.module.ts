import { Module } from '@nestjs/common';
import { DoorService } from './door.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { DoorController } from './door.controller';

@Module({
  imports:[NotificationsModule],
  providers: [DoorService],
  controllers:[DoorController],
  exports: [DoorService],
})
export class DoorModule {}
