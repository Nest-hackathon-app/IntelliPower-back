import { Module } from '@nestjs/common';
import { TemperatureController } from './temperature.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TemperatureService } from './temperature.service';
import { HttpWrapperModule } from 'src/http-wrapper/http-wrapper.module';

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
    HttpWrapperModule
  ],
  controllers: [TemperatureController],
  providers: [TemperatureService],
})
export class TemperatureModule {}
