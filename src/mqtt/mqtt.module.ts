import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MQTT_PUBLISHER } from 'src/utils/constants';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: MQTT_PUBLISHER,
        transport: Transport.MQTT,
        options: {
          host: 'localhost',
          port: 1883,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MqttModule {}
