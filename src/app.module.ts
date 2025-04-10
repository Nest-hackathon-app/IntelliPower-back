import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './db/prisma.module';
import { TemperatureModule } from './temperature/temperature.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    TemperatureModule,
    NotificationsModule,
     ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
