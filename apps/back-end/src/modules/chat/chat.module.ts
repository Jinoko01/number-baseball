import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RoomService } from '../room/room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { RoomParticipant } from '../entities/room-participant.entity';
import { Users } from '../entities/users.entity';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([Room, Users, RoomParticipant]),
  ],
  providers: [ChatGateway, RoomService],
})
export class ChatModule {}
