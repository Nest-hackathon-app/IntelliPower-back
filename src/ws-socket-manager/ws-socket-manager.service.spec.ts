import { Test, TestingModule } from '@nestjs/testing';
import { WsSocketManagerService } from './ws-socket-manager.service';

describe('WsSocketManagerService', () => {
  let service: WsSocketManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WsSocketManagerService],
    }).compile();

    service = module.get<WsSocketManagerService>(WsSocketManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
