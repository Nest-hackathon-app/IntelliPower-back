import { SensorType } from '@prisma/client';

export interface IsensorSeeder {
  id: string;
  name: string;
  areaId: string;
  locationX: number;
  locationY: number;
  type: SensorType;
}
