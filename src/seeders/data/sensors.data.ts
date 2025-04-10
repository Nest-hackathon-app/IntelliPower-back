import { SensorType } from '@prisma/client';
import { IsensorSeeder } from '../interfrace/sensor.interface';

export const sensorsData: IsensorSeeder[] = [
  {
    id: 'sensor-1',
    sensorName: 'Temperature Sensor',
    sensorType: SensorType.temperature,
  },
  {
    id: 'sensor2',
    sensorName: 'Humidity Sensor',
    sensorType: SensorType.temperature,
  },
];
