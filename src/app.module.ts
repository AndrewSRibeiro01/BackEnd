import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './shared/database/database.module';
import { LoggerModule } from './shared/logger/logger.module';
import { envValidationSchema } from './shared/config/env.validation';
import { FarmsModule } from './modules/farms/farms.module';
import { ProducersModule } from './modules/producers/producers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: envValidationSchema,
    }),
    LoggerModule,
    DatabaseModule,
    ProducersModule,
    FarmsModule,
  ],
})
export class AppModule {}
