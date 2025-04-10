import { Test, TestingModule } from '@nestjs/testing';
import { FanControlService } from './fan-control.service';

describe('FanControlService', () => {
  let service: FanControlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FanControlService],
    }).compile();

    service = module.get<FanControlService>(FanControlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
