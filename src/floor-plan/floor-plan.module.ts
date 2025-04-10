import { Module } from '@nestjs/common';
import { FloorPlanService } from './floor-plan.service';
import { FloorPlanController } from './floor-plan.controller';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [FloorPlanController],
  imports: [AuthModule, HttpModule.register({ timeout: 200000 })],
  providers: [FloorPlanService],
})
export class FloorPlanModule {}
