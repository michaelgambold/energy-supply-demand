import { Test, TestingModule } from '@nestjs/testing';
import { DataGateway } from './data.gateway';
// import { SocketService } from './socket.service';

describe('DataGateway', () => {
  let gateway: DataGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataGateway], //, SocketService],
    }).compile();

    gateway = module.get<DataGateway>(DataGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
