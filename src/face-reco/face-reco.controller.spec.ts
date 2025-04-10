import { Test, TestingModule } from '@nestjs/testing';
import { FaceRecoController } from './face-reco.controller';
import { FaceRecoService } from './face-reco.service';

describe('FaceRecoController', () => {
  let controller: FaceRecoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaceRecoController],
      providers: [FaceRecoService],
    }).compile();

    controller = module.get<FaceRecoController>(FaceRecoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
