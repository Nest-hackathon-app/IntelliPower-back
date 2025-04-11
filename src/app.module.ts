import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './db/prisma.module';
import { TemperatureModule } from './temperature/temperature.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FloorPlanModule } from './floor-plan/floor-plan.module';
import { ConsumtionModule } from './consumtion/consumtion.module';
import { AnomaliesModule } from './anomalies/anomalies.module';
import { FanControlModule } from './fan-control/fan-control.module';
import { WsSocketManagerModule } from './ws-socket-manager/ws-socket-manager.module';
import { Reflector } from '@nestjs/core';
import { FaceRecoModule } from './face-reco/face-reco.module';
import { BuzzerModule } from './buzzer/buzzer.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MQTT_PUBLISHER } from './utils/constants';
import { MqttModule } from './mqtt/mqtt.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    TemperatureModule,
    FloorPlanModule,
    NotificationsModule,
    ConsumtionModule,
    AnomaliesModule,
    FanControlModule,
    WsSocketManagerModule,
    FaceRecoModule,
    BuzzerModule,
        MqttModule,
        RedisModule,
  ],
  providers: [AppService, Reflector],
})
export class AppModule {}
