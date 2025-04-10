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
@ApiTags('Fan Control Gateway')
@WebSocketGateway()
export class FanControlGateway {
  constructor(private readonly fanControlService: FanControlService) {}
  logger = new Logger(FanControlGateway.name);

  @SubscribeMessage(FAN_CONTROL_MESSAGE.FAN_TURN_ON)
  handleFanTurnOn(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    this.logger.log('SENDING MQTT CMD');
    return FAN_CONTROL_EVENTS.FAN_TURNED_OFF;
  }
  @SubscribeMessage(FAN_CONTROL_MESSAGE.FAN_TURN_OFF)
  handleFanTurnOff(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    this.logger.log('SENDING MQTT CMD');
    return FAN_CONTROL_EVENTS.FAN_TURNED_OFF;
  }
  @SubscribeMessage(FAN_CONTROL_MESSAGE.FAN_SET_SPEED)
  handleFanSetSpeed(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    this.logger.log('SENDING MQTT CMD TO CHANGE FAN SPEED');
    return FAN_CONTROL_EVENTS.FAN_SPEED_CHANGED;
  }
  @SubscribeMessage(FAN_CONTROL_MESSAGE.FAN_GET_STATUS)
  handleFanGetStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    this.logger.log('SENDING MQTT CMD TO GET FAN STATUS');
    return FAN_CONTROL_EVENTS.FAN_TURNED_OFF;
  }
  @SubscribeMessage(FAN_CONTROL_MESSAGE.FAN_CHANGE_AIR_FLOW)
  handleFanChangeAirFlow(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    this.logger.log('SENDING MQTT CMD TO CHANGE AIR FLOW');
    return FAN_CONTROL_EVENTS.FAN_CHANDEGD_AIR_FLOW;
  }
}
