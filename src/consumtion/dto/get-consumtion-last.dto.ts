import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class GetConsumptionLastDto {
  @ApiProperty({ enum: ['DAY', 'WEEK', 'MONTH'] })
  @IsEnum(['DAY', 'WEEK', 'MONTH'])
  type: 'DAY' | 'WEEK' | 'MONTH';
}
