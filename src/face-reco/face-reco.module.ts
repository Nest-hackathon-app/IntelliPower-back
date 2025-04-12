import { Module } from '@nestjs/common';
import { FaceRecoService } from './face-reco.service';
import { FaceRecoController } from './face-reco.controller';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule } from '@nestjs/microservices';
import { MqttModule } from 'src/mqtt/mqtt.module';
import { RedisModule } from 'src/redis/redis.module';
import { BuzzerModule } from 'src/buzzer/buzzer.module';
import { DoorModule } from 'src/door/door.module';

@Module({
  imports: [
    HttpModule.register({ timeout: 100000 }),
    MqttModule,
    RedisModule,
    BuzzerModule,
    DoorModule
  ],
  controllers: [FaceRecoController],
  providers: [FaceRecoService],
})
export class FaceRecoModule {}
