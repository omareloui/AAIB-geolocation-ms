import { Module } from '@nestjs/common';
import { FilterService } from './filter.service';

@Module({
  providers: [FilterService]
})
export class FilterModule {}
