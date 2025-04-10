import { SensorType } from '@prisma/client';
import { IsensorSeeder } from '../interfrace/sensor.interface';
const areaId = '15bd8822-cce9-497d-8b0d-d5e6f4955d51';
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
  {
    id: 'Load1',
    name: 'consumption Sensor',
    areaId,
    locationX: 10,
    locationY: 20,
    type: SensorType.ELECTRICITY,
  },
  {
    id: 'Load2',
    name: 'consumption Sensor',
    areaId,
    locationX: 30,
    locationY: 40,
    type: SensorType.ELECTRICITY,
  },
];
