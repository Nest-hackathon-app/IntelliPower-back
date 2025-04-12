import { Module } from '@nestjs/common';
import { TemperatureController } from './temperature.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TemperatureService } from './temperature.service';
import { HttpWrapperModule } from 'src/http-wrapper/http-wrapper.module';
import { FaceRecoService } from 'src/face-reco/face-reco.service';
import { FaceRecoModule } from 'src/face-reco/face-reco.module';
import { DoorModule } from 'src/door/door.module';

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
    FaceRecoModule,
    HttpWrapperModule,
    DoorModule,

  ],
  controllers: [TemperatureController],
  providers: [TemperatureService],
})
export class TemperatureModule {}
