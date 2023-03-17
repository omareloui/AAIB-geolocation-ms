import { Test, TestingModule } from '@nestjs/testing';
import { MainController } from './main.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import { FilterService } from '../filter/filter.service';
import { MainService } from './main.service';

import config from '../../config/config';

describe('MainController', () => {
  let controller: MainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainController],
      imports: [ConfigModule.forRoot({ load: [config] })],
      providers: [DatabaseService, FilterService, MainService],
    }).compile();

    controller = module.get<MainController>(MainController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
