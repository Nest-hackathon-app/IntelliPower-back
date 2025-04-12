import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { FanControlService } from './fan-control.service';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { FAN_CONTROL_EVENTS, FAN_CONTROL_MESSAGE } from './constants';
import { ApiTags } from '@nestjs/swagger';
import { FanSpeed, FanStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';


class fanStatusChangeDto {
  @IsNotEmpty()
  @IsString()
  fanId: string;
}
class fanSpeedChangeDto extends fanStatusChangeDto {
  @IsNotEmpty()
  @IsEnum(FanSpeed)
  speed: FanSpeed;
}

@ApiTags('Fan Control Gateway')
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FanControlGateway {
  constructor(private readonly fanControlService: FanControlService) {}
  logger = new Logger(FanControlGateway.name);

  @SubscribeMessage(FAN_CONTROL_MESSAGE.FAN_TURN_ON)
  async handleFanTurnOn(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: fanStatusChangeDto,
  ) {
    await this.fanControlService.changeFanState(data.fanId, 'on');
    return client.broadcast.emit(FAN_CONTROL_EVENTS.FAN_TURNED_ON, {
      fanId: data.fanId,
      status: 'on',
    });
  }
  @SubscribeMessage(FAN_CONTROL_MESSAGE.FAN_TURN_OFF)
  async handleFanTurnOff(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: fanStatusChangeDto,
  ) {
    await this.fanControlService.changeFanState(data.fanId, 'off');
    client.broadcast.emit(FAN_CONTROL_EVENTS.FAN_TURNED_OFF, {
      fanId: data.fanId,
      status: 'off',
    });
    return FAN_CONTROL_EVENTS.FAN_TURNED_OFF;
  }
  @SubscribeMessage(FAN_CONTROL_MESSAGE.FAN_SET_SPEED)
  async handleFanSetSpeed(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: fanSpeedChangeDto,
  ) {
    await this.fanControlService.changeFanSpeed(data.fanId, data.speed);
    client.broadcast.emit(FAN_CONTROL_EVENTS.FAN_SPEED_CHANGED, {
      fanId: data.fanId,
      speed: data.speed,
    });
  }
  }
