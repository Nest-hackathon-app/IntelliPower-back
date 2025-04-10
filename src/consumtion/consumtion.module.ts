import { Module } from '@nestjs/common';
import { ConsumtionService } from './consumtion.service';
import { ConsumtionController } from './consumtion.controller';

@Module({
  controllers: [ConsumtionController],
  providers: [ConsumtionService],
})
export class ConsumtionModule {}
