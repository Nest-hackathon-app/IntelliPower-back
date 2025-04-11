import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MqttModule } from 'src/mqtt/mqtt.module';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  imports: [AuthModule, UserModule, MqttModule],
})
export class EmployeesModule {}
