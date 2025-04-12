import { Test, TestingModule } from '@nestjs/testing';
import { AiChallengeService } from './ai-challenge.service';

describe('AiChallengeService', () => {
  let service: AiChallengeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiChallengeService],
    }).compile();

    service = module.get<AiChallengeService>(AiChallengeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
