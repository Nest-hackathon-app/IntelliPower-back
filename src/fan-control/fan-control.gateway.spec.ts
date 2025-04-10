import { Test, TestingModule } from '@nestjs/testing';
import { FanControlGateway } from './fan-control.gateway';
import { FanControlService } from './fan-control.service';

describe('FanControlGateway', () => {
  let gateway: FanControlGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FanControlGateway, FanControlService],
    }).compile();

    gateway = module.get<FanControlGateway>(FanControlGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
