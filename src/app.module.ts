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
import { MqttModule } from './mqtt/mqtt.module';
import { RedisModule } from './redis/redis.module';
import { EmployeesModule } from './employees/employees.module';
import { DoorModule } from './door/door.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 100000,
      maxRedirects: 5,
    }),
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
    EmployeesModule,
    DoorModule,
    HealthCheckModule,
  ],
  providers: [AppService, Reflector],
})
export class AppModule {}
