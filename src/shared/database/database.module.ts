import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

const logger = new Logger('DatabaseModule');

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const url = config.get<string>('DATABASE_URL');
        const isProd = config.get<string>('NODE_ENV') === 'production';

        const base = {
          type: 'postgres' as const,
          autoLoadEntities: true,
          synchronize: true,
        };

        if (url) {
          const masked = url.replace(/:\/\/([^:]+):[^@]+@/, '://$1:***@');
          logger.log(`Connecting via DATABASE_URL → ${masked}`);
          return {
            ...base,
            url,
            ssl: isProd ? { rejectUnauthorized: false } : false,
          };
        }

        if (isProd) {
          throw new Error(
            'DATABASE_URL is required in production but was not provided',
          );
        }

        const host = config.get<string>('DATABASE_HOST');
        logger.log(
          `Connecting via DATABASE_HOST=${host} DATABASE_NAME=${config.get('DATABASE_NAME')}`,
        );
        return {
          ...base,
          host,
          port: config.get<number>('DATABASE_PORT'),
          username: config.get<string>('DATABASE_USER'),
          password: config.get<string>('DATABASE_PASSWORD'),
          database: config.get<string>('DATABASE_NAME'),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
