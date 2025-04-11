import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  imports: [AuthModule, UserModule],
})
export class EmployeesModule {}
