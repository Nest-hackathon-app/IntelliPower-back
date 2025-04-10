import { Module } from '@nestjs/common';
import { FanControlService } from './fan-control.service';
import { FanControlGateway } from './fan-control.gateway';
import { FanControlGatewayDocsController } from './fan-control.controller';

@Module({
  providers: [FanControlGateway, FanControlService],
  controllers: [FanControlGatewayDocsController],
})
export class FanControlModule {}
