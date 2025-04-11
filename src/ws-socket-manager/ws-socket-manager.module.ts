import { Module } from '@nestjs/common';
import { WsSocketManagerService } from './ws-socket-manager.service';
import { WsSocketManagerGateway } from './ws-socket-manager.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [WsSocketManagerGateway, WsSocketManagerService],
  imports: [AuthModule, UserModule],
})
export class WsSocketManagerModule {}
