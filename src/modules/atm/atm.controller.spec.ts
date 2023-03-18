import { Test, TestingModule } from '@nestjs/testing';
import { AtmController } from './atm.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import { FilterService } from '../filter/filter.service';
import { AtmService } from './atm.service';

import config from '../../config/config';

describe('AtmController', () => {
  let controller: AtmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtmController],
      imports: [ConfigModule.forRoot({ load: [config] })],
      providers: [DatabaseService, FilterService, AtmService],
    }).compile();

    controller = module.get<AtmController>(AtmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
