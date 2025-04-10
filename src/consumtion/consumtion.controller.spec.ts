import { Test, TestingModule } from '@nestjs/testing';
import { ConsumtionController } from './consumtion.controller';
import { ConsumtionService } from './consumtion.service';

describe('ConsumtionController', () => {
  let controller: ConsumtionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsumtionController],
      providers: [ConsumtionService],
    }).compile();

    controller = module.get<ConsumtionController>(ConsumtionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
