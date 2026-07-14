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
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),

        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),

        database: config.get<string>('DB_NAME'),

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
