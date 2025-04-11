/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PaginationDtoReq {
  @ApiProperty({ description: 'The page number' })
  @Transform((value) => parseInt(value.value))
  @IsInt()
  @Min(1)
  page: number;
  @ApiProperty({ description: 'The limit of the page' })
  @Transform((value) => parseInt(value.value))
  @IsInt()
  @Min(0)
  limit: number;
}
