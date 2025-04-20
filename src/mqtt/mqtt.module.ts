import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MQTT_PUBLISHER } from 'src/utils/constants';
@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: MQTT_PUBLISHER,
        transport: Transport.MQTT,
        options: {
          host: process.env.MQTT_HOST,
          port: Number(process.env.MQTT_PORT),
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MqttModule {}
