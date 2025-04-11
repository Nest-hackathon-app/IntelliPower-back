import { Test, TestingModule } from '@nestjs/testing';
import { BuzzerService } from './buzzer.service';

describe('BuzzerService', () => {
  let service: BuzzerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuzzerService],
    }).compile();

    service = module.get<BuzzerService>(BuzzerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
