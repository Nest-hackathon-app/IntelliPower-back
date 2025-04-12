import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MQTT_PUBLISHER } from 'src/utils/constants';

@Injectable()
export class HealthCheckService {
  constructor(@Inject(MQTT_PUBLISHER) private readonly pub: ClientProxy) {}
  sendHealthCheckSignal() {
    this.pub.emit('health-check', {
      message: 'Health check signal sent',
    });
  }
}
