import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { UsersService } from './user.service';
import { jwtGuard } from 'src/auth/guards/jwt.guard';

@Module({
  controllers: [UserController],
  providers: [UsersService,jwtGuard],
  exports: [UsersService,jwtGuard],
})
export class UserModule {}
