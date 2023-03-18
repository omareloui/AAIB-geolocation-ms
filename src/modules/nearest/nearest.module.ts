import { Module } from '@nestjs/common';
import { NearestService } from './nearest.service';
import { NearestController } from './nearest.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  providers: [NearestService, DatabaseService],
  controllers: [NearestController],
})
export class NearestModule {}
