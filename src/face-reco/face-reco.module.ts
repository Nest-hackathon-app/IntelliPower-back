import { Module } from '@nestjs/common';
import { FaceRecoService } from './face-reco.service';
import { FaceRecoController } from './face-reco.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({ timeout: 100000 })],
  controllers: [FaceRecoController],
  providers: [FaceRecoService],
})
export class FaceRecoModule {}
