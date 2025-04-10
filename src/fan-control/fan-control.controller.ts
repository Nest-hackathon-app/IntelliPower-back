import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import { FAN_CONTROL_EVENTS, FAN_CONTROL_MESSAGE } from './constants';

@ApiTags('FanControl Gateway')
@Controller('fan-control') // Just for documentation purposes, not actually used
export class FanControlGatewayDocsController {
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
  @Post('turn-on')
  turnFanOn() {}

  @Post('turn-off')
  @ApiOperation({
    summary: 'Turn fan off',
    description: `WebSocket message to turn the fan off.
    \nClient sends: "${FAN_CONTROL_MESSAGE.FAN_TURN_OFF}"\nServer emits: "${FAN_CONTROL_EVENTS.FAN_TURNED_OFF}"`,
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

  @ApiOperation({
    summary: 'Get fan status',
    description: `WebSocket message to request fan status.
    \nClient sends: "${FAN_CONTROL_MESSAGE.FAN_GET_STATUS}"\nServer emits: (varies)`,
  })
  @ApiBody({
    schema: {
      example: {
        deviceId: 'fan-1',
      },
    },
  })
  @Post('get-status')
  getFanStatus() {}

  @ApiOperation({
    summary: 'Change air flow',
    description: `WebSocket message to change the air flow mode of the fan.
    \nClient sends: "${FAN_CONTROL_MESSAGE.FAN_CHANGE_AIR_FLOW}"\nServer emits: "${FAN_CONTROL_EVENTS.FAN_CHANDEGD_AIR_FLOW}"`,
  })
  @ApiBody({
    schema: {
      example: {
        deviceId: 'fan-1',
        mode: 'natural', // or 'direct', etc.
      },
    },
  })
  @Post('change-air-flow')
  changeAirFlow() {}
}
