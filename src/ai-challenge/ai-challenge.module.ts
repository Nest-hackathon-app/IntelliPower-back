import { Module } from '@nestjs/common';
import { AiChallengeService } from './ai-challenge.service';
import { AiChallengeController } from './ai-challenge.controller';
import { PrismaService } from '../db/prisma.service';

@Module({
  controllers: [AiChallengeController],
  providers: [AiChallengeService, PrismaService],
  exports: [AiChallengeService],
})
export class AiChallengeModule {}
