import { Module } from '@nestjs/common';
import { TemperatureController } from './temperature.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TemperatureService } from './temperature.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ALERT_SERVICE',
        transport: Transport.MQTT,
        options: {
          host: 'localhost',
          port: 1883,
        },
      },
    ]),
  ],
  controllers: [TemperatureController],
  providers: [TemperatureService],
})
export class TemperatureModule {}
