import { GoneException } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetGroupedDataDto{
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  groupBy: GROUPBY;
}

export const groupBy = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
} as const;
export type GROUPBY = (typeof groupBy)[keyof typeof groupBy];
