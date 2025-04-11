import { Test, TestingModule } from '@nestjs/testing';
import { BuzzerController } from './buzzer.controller';
import { BuzzerService } from './buzzer.service';

describe('BuzzerController', () => {
  let controller: BuzzerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuzzerController],
      providers: [BuzzerService],
    }).compile();

    controller = module.get<BuzzerController>(BuzzerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
