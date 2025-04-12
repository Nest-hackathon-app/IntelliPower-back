import { ApiProperty } from '@nestjs/swagger';
import { FanSpeed } from '@prisma/client';

export class fanSpeedResponseDto {
  @ApiProperty({ name: 'fanId', description: 'The id of the fan' })
  fanId: string;
  @ApiProperty({ description: 'The speed of the fan', enum: FanSpeed })
  speed: FanSpeed;
}
