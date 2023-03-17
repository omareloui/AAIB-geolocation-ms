import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { GlobalModule } from './global.module';
import { LoggingMiddlewareService } from './middlewares/logging-middleware.service';
import { MainModule } from './modules/main/main.module';
import { DatabaseModule } from './modules/database/database.module';
import { FilterModule } from './modules/filter/filter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    GlobalModule,
    MainModule,
    DatabaseModule,
    FilterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddlewareService).forRoutes('*');
  }
}
