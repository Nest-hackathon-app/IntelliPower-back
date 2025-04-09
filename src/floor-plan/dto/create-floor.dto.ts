import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateFloorDto {
  @ApiProperty({ description: 'Name of the floor' })
  @IsString()
  name: string;
  @ApiProperty({
    description: 'Floor number if not provided it will be auto generated',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  order?: number;
}
