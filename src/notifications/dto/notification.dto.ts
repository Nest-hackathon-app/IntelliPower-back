import { ApiProperty } from '@nestjs/swagger';
import {
  NotificationPriority,
  NotificationType,
  UserRole,
} from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsString,
  validate,
  ValidateIf,
} from 'class-validator';

export class createNotificationDto {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  message: string;
  @IsEnum(NotificationType)
  @ApiProperty({ enum: NotificationType })
  type: NotificationType;
  @IsEnum(NotificationPriority)
  @ApiProperty({ enum: NotificationPriority })
  priority: NotificationPriority;
  @ApiProperty()
  userIds?: string[];
  @ApiProperty()
  @ValidateIf((o: createNotificationDto) => o.userIds?.length! <= 0)
  @IsEnum(UserRole)
  roles?: UserRole[];
}
