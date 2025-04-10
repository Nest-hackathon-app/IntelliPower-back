import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './db/prisma.module';
import { TemperatureModule } from './temperature/temperature.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FloorPlanModule } from './floor-plan/floor-plan.module';
import { ConsumtionModule } from './consumtion/consumtion.module';
import { JwtModule } from '@nestjs/jwt';
import { AnomaliesModule } from './anomalies/anomalies.module';
import { FanControlModule } from './fan-control/fan-control.module';
import { WsSocketManagerModule } from './ws-socket-manager/ws-socket-manager.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { RoleGuard } from './auth/guards/role.guard';

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
  ],
  controllers: [AppController],
  providers: [AppService, Reflector],
})
export class AppModule {}
