import { Module } from '@nestjs/common';
import { FaceRecoService } from './face-reco.service';
import { FaceRecoController } from './face-reco.controller';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule } from '@nestjs/microservices';
import { MqttModule } from 'src/mqtt/mqtt.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [HttpModule.register({ timeout: 100000 }), MqttModule, RedisModule],
  controllers: [FaceRecoController],
  providers: [FaceRecoService],
})
export class FaceRecoModule {}
