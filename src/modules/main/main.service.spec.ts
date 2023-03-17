import { Test, TestingModule } from '@nestjs/testing';
import { MainService } from './main.service';
import { DatabaseService } from '../database/database.service';
import { ConfigModule } from '@nestjs/config';

import config from '../../config/config';

describe('MainService', () => {
  let service: MainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, cache: true, load: [config] }),
      ],
      providers: [MainService, DatabaseService],
    }).compile();

    service = module.get<MainService>(MainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
