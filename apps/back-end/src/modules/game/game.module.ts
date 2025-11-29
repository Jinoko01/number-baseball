import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { RoomModule } from '../room/room.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, JwtModule.register({}), RoomModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
