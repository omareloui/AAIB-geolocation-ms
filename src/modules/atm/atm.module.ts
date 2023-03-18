import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { FilterService } from '../filter/filter.service';
import { NearestService } from '../nearest/nearest.service';
import { AtmController } from './atm.controller';
import { AtmService } from './atm.service';

@Module({
  providers: [AtmService, DatabaseService, FilterService, NearestService],
  controllers: [AtmController],
})
export class AtmModule {}
