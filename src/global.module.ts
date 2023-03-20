import { Module, Global } from '@nestjs/common';
import { CustomWinstonLogger } from './helpers/logger.service';

@Global()
@Module({
  providers: [CustomWinstonLogger],
  exports: [CustomWinstonLogger],
})
export class GlobalModule {}
