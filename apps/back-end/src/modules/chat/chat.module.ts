import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RoomService } from '../room/room.service';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  providers: [ChatGateway, RoomService],
})
export class ChatModule {}
