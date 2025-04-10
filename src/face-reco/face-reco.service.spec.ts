import { Test, TestingModule } from '@nestjs/testing';
import { FaceRecoService } from './face-reco.service';

describe('FaceRecoService', () => {
  let service: FaceRecoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaceRecoService],
    }).compile();

    service = module.get<FaceRecoService>(FaceRecoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
