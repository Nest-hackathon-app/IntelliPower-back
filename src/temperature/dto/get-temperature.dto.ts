import { GoneException } from '@nestjs/common';

export class GetTemperatureDto {
  startDate: Date;
  endDate: Date;
  groupBy: GROUPBY;
}

export const groupBy = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
} as const;
export type GROUPBY = (typeof groupBy)[keyof typeof groupBy];
