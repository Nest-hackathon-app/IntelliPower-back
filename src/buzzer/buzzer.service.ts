import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MQTT_PUBLISHER } from 'src/utils/constants';

@Injectable()
export class BuzzerService {
  constructor(@Inject(MQTT_PUBLISHER) private readonly pub: ClientProxy) {}
  sendBuzzSignal(buzzerId: string) {
    this.pub.emit('buzz', {
      buzzerId,
    });
  }
}
