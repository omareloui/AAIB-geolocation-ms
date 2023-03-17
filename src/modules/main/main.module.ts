import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { DatabaseService } from '../database/database.service';
import { FilterService } from '../filter/filter.service';
import { MainService } from './main.service';

@Module({
  providers: [MainService, DatabaseService, FilterService],
  controllers: [MainController],
})
export class MainModule {}
