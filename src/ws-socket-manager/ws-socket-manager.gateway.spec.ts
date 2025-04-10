import { Test, TestingModule } from '@nestjs/testing';
import { WsSocketManagerGateway } from './ws-socket-manager.gateway';
import { WsSocketManagerService } from './ws-socket-manager.service';

describe('WsSocketManagerGateway', () => {
  let gateway: WsSocketManagerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WsSocketManagerGateway, WsSocketManagerService],
    }).compile();

    gateway = module.get<WsSocketManagerGateway>(WsSocketManagerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
