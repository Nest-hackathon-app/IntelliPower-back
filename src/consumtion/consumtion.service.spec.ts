import { Test, TestingModule } from '@nestjs/testing';
import { ConsumtionService } from './consumtion.service';

describe('ConsumtionService', () => {
  let service: ConsumtionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsumtionService],
    }).compile();

    service = module.get<ConsumtionService>(ConsumtionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
