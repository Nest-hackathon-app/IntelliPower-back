import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { UsersService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UsersService],
})
export class UserModule {}
