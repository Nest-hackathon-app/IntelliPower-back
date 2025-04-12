import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WsSocketManagerService } from './ws-socket-manager.service';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Handshake } from 'socket.io/dist/socket-types';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
import { jwtPayload } from 'src/auth/interfaces/jwtPayload';
import { user } from '@prisma/client';

@WebSocketGateway()
export class WsSocketManagerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  logger = new Logger(WsSocketManagerGateway.name);
  constructor(
    private readonly wsSocketManagerService: WsSocketManagerService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.wsSocketManagerService.removeClient(
      (client['user'] as user).id,
      client,
    );
  }
  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      this.logger.log('Client' + client.id + 'Trying to connect');
      const handShake = client.handshake;
      const token = this.extractTokenFromHandshake(handShake);
      if (token == '' || token == null) {
        this.logger.error('provide a token in the header or Auth Body');
        client.disconnect();
        return 'error';
      }
      const accessTokenPayload = this.jwtService.verify<jwtPayload>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (!accessTokenPayload) {
        this.logger.error('disconnect due to no accesToken');
        client.disconnect();
        return 'error';
      }
      const user = await this.userService.findOne(accessTokenPayload.id);
      if (!user) {
        this.logger.error('disconnect due to no user');
        client.disconnect();
        return 'error';
      }
      client['user'] = user;
      this.logger.log('Client' + client.id + 'Connected');
      this.wsSocketManagerService.addClient(user.id, client);
    } catch (e) {
      this.logger.error('Error is ' + e);
      client.disconnect();
      return 'error';
    }
  }
  extractTokenFromHandshake(handShake: Handshake) {
    console.log('handShake', handShake.auth);
    const auth: string = (handShake.auth['token'] ??
      handShake.headers['token']) as string;
    const token = auth?.split(' ')[1] ?? auth;
    if (auth?.includes('Bearer')) {
      return token;
    }
    return '';
  }
}
