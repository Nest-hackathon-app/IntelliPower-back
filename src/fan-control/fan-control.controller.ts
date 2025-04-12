import { Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiTags,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { FAN_CONTROL_EVENTS, FAN_CONTROL_MESSAGE } from './constants';
import { FanControlService } from './fan-control.service';
import { FanStatus } from '@prisma/client';
import { fanStatusChangeResponseDto } from './dtos/fan-status.dto';
import { fanSpeedResponseDto } from './dtos/fan-speed.dto';

@ApiTags('FanControl Gateway')
@Controller('fan-control') // Just for documentation purposes, not actually used
export class FanControlGatewayDocsController {
  constructor(private readonly fansService: FanControlService) {}
  @ApiOperation({
    summary: 'Turn fan on',
    description: `WebSocket message to turn the fan on.
    \nClient sends: "${FAN_CONTROL_MESSAGE.FAN_TURN_ON}"\nServer emits: "${FAN_CONTROL_EVENTS.FAN_TURNED_ON}"`,
  })
  @ApiBody({
    schema: {
      example: {
        deviceId: 'fan-1',
      },
    },
  })
  @ApiResponse({
    type: fanStatusChangeResponseDto,
  })
  @Post('turn-on')
  turnFanOn() {}

  @Post('turn-off')
  @ApiOperation({
    summary: 'Turn fan off',
    description: `WebSocket message to turn the fan off.
    \nClient sends: "${FAN_CONTROL_MESSAGE.FAN_TURN_OFF}"\nServer emits: "${FAN_CONTROL_EVENTS.FAN_TURNED_OFF}"`,
  })
  @ApiResponse({
    type: fanStatusChangeResponseDto,
  })
  @ApiBody({
    schema: {
      example: {
        deviceId: 'fan-1',
      },
    },
  })
  turnFanOff() {}

  @ApiOperation({
    summary: 'Set fan speed',
    description: `WebSocket message to set the fan speed.
    \nClient sends: "${FAN_CONTROL_MESSAGE.FAN_SET_SPEED}"\nServer emits: "${FAN_CONTROL_EVENTS.FAN_SPEED_CHANGED}"`,
  })
  @ApiResponse({
    type: fanSpeedResponseDto,
  })
  @ApiBody({
    schema: {
      example: {
        deviceId: 'fan-1',
        speed: 3,
      },
    },
  })
  @Post('set-speed')
  setFanSpeed() {}
  @Get('get-floor-fans/:floorId')
  @ApiOperation({
    summary: 'Get all fans by floor',
    description: `Get all fans by floor`,
  })
  getFloorFans(@Param('floorId') floorId: string) {
    return this.fansService.getFloorFans(floorId);
  }
}
