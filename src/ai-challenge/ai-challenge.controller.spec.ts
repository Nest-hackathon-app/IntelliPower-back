import { Test, TestingModule } from '@nestjs/testing';
import { AiChallengeController } from './ai-challenge.controller';
import { AiChallengeService } from './ai-challenge.service';

describe('AiChallengeController', () => {
  let controller: AiChallengeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiChallengeController],
      providers: [AiChallengeService],
    }).compile();

    controller = module.get<AiChallengeController>(AiChallengeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
