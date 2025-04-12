import { Module } from '@nestjs/common';
import { AiChallengeService } from './ai-challenge.service';
import { AiChallengeController } from './ai-challenge.controller';

@Module({
  controllers: [AiChallengeController],
  providers: [AiChallengeService],
})
export class AiChallengeModule {}
