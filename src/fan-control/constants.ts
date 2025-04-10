export const FAN_CONTROL_MESSAGE = {
  FAN_TURN_ON: 'turn_on',
  FAN_TURN_OFF: 'turn_off',
  FAN_SET_SPEED: 'set_speed',
  FAN_GET_STATUS: 'get_status',
  FAN_CHANGE_AIR_FLOW: 'change_air_flow',
} as const;
export const FAN_CONTROL_EVENTS = {
  FAN_TURNED_ON: 'fan_turned_on',
  FAN_TURNED_OFF: 'fan_turned_off',
  FAN_SPEED_CHANGED: 'fan_speed_changed',
  FAN_CHANDEGD_AIR_FLOW: 'fan_changed_air_flow',
} as const;
