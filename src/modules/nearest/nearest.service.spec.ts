import { Test, TestingModule } from '@nestjs/testing';
import { NearestService } from './nearest.service';

describe('NearestService', () => {
  let service: NearestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NearestService],
    }).compile();

    service = module.get<NearestService>(NearestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
