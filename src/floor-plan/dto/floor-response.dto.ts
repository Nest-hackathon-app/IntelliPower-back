import { ApiProperty } from '@nestjs/swagger';
import { AreaType } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export class FloorResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
export class pointDto {
  @ApiProperty()
  x: number;
  @ApiProperty()
  y: number;
}
export class AreaResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: pointDto, isArray: true })
  polygon: JsonValue[];
  @ApiProperty()
  capacity: number;
  @ApiProperty({ enum: AreaType })
  type: AreaType;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
export class FloorWithAreasResponseDto extends FloorResponseDto {
  @ApiProperty({ type: AreaResponseDto, isArray: true })
  areas: AreaResponseDto[];
}
