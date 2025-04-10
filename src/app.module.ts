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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
