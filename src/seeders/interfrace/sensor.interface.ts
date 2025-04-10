import { SensorType } from '@prisma/client';

export interface IsensorSeeder {
  idd: string;
  sensorName: string;
  sensorType: SensorType;
}
