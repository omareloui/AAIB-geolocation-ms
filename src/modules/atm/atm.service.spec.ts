import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { ConfigModule } from '@nestjs/config';
import { AtmService } from './atm.service';

import config from '../../config/config';

describe('AtmService', () => {
  let service: AtmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, cache: true, load: [config] }),
      ],
      providers: [AtmService, DatabaseService],
    }).compile();

    service = module.get<AtmService>(AtmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
