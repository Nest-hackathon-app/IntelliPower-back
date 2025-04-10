import { Module } from '@nestjs/common';
import { FloorPlanService } from './floor-plan.service';
import { FloorPlanController } from './floor-plan.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [FloorPlanController],
  imports: [AuthModule],
  providers: [FloorPlanService],
})
export class FloorPlanModule {}
