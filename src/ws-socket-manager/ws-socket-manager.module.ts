import { Module } from '@nestjs/common';
import { WsSocketManagerService } from './ws-socket-manager.service';
import { WsSocketManagerGateway } from './ws-socket-manager.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [WsSocketManagerGateway, WsSocketManagerService],
  imports:[JwtModule,UserModule]
})
export class WsSocketManagerModule {}
