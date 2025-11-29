import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModule } from './modules/room/room.module';
import { AuthModule } from './modules/auth/auth.module';
import typeorm from './config/typeorm';
import { ChatModule } from './modules/chat/chat.module';
import { CacheModule } from '@nestjs/cache-manager';
import { GameModule } from './modules/game/game.module';
import { redisStore } from 'cache-manager-redis-yet';
import { SentryModule, SentryGlobalFilter } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    SentryModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        ttl: 1000 * 60 * 60 * 24,
        store: await redisStore({
          url: process.env.REDIS_URL ?? 'redis://localhost:6379',
        }),
      }),
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow('typeorm'),
    }),
    UsersModule,
    RoomModule,
    AuthModule,
    ChatModule,
    GameModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
