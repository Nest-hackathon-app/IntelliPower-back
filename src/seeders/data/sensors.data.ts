import { SensorType } from '@prisma/client';
import { IsensorSeeder } from '../interfrace/sensor.interface';
const areaId = '4c717665-606c-451b-83cb-269fab8ab1d4';
export const sensorsData: IsensorSeeder[] = [
  {
    id: 'sensor-1',
    name: 'Sensor 1',
    areaId,
    locationX: 10,
    locationY: 20,
    type: SensorType.TEMPERATURE,
  },
  {
    id: 'sensor-2',
    name: 'Sensor 2',
    areaId,
    locationX: 30,
    locationY: 40,
    type: SensorType.TEMPERATURE,
  },
  {
    id: 'sensor-3',
    name: 'Sensor 3',
    areaId,
    locationX: 50,
    locationY: 60,
    type: SensorType.TEMPERATURE,
  },
];
