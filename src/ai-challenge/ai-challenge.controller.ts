import { Controller } from '@nestjs/common';
import { AiChallengeService } from './ai-challenge.service';

@Controller('ai-challenge')
export class AiChallengeController {
  constructor(private readonly aiChallengeService: AiChallengeService) {}
}
