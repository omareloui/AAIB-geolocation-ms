import { Test, TestingModule } from '@nestjs/testing';
import { NearestController } from './nearest.controller';

describe('NearestController', () => {
  let controller: NearestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NearestController],
    }).compile();

    controller = module.get<NearestController>(NearestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
