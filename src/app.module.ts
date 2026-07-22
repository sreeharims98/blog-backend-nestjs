import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RefreshTokensModule } from './refresh_tokens/refresh_tokens.module';
import { VerificationTokenModule } from './verification_token/verification_token.module';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import mailConfig from './config/mail.config';
import redisConfig from './config/redis.config';
import { validate } from './config/env.validation';
import { PasswordResetTokensModule } from './password_reset_tokens/password_reset_tokens.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // time window in milliseconds (60s)
        limit: 20, // max requests per window, per IP
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [databaseConfig, jwtConfig, mailConfig, redisConfig],
    }),
    CacheModule.registerAsync({
      isGlobal: true, // makes CACHE_MANAGER injectable everywhere, no need to re-import per module
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        stores: [
          createKeyv(
            `redis://${config.get<string>('redis.host')}:${config.get<number>('redis.port')}`,
          ),
        ],
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),

        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),

        database: config.get<string>('database.database'),

        autoLoadEntities: true,

        synchronize: false,
        migrations: ['dist/migrations/*.js'], // compiled JS path for runtime
        migrationsRun: true, // auto-run pending migrations on startup — optional
      }),
    }),

    AuthModule,
    UsersModule,
    BlogsModule,
    RefreshTokensModule,
    VerificationTokenModule,
    PasswordResetTokensModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // applies to every route by default
    },
  ],
})
export class AppModule {}
