import { Module } from '@nestjs/common';
import { NearestService } from './nearest.service';
import { NearestController } from './nearest.controller';
import { DatabaseService } from '../database/database.service';
import { AtmService } from '../atm/atm.service';

@Module({
  providers: [AtmService, NearestService, DatabaseService],
  controllers: [NearestController],
})
export class NearestModule {}
