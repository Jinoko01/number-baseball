import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { Users } from '../entities/users.entity';
import { RoomParticipant } from '../entities/room-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Users, RoomParticipant])],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
