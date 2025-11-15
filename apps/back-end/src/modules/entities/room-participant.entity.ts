import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Room } from './room.entity';
import { Users } from './users.entity';
import { RoomParticipantRole } from '../../common/enum/room-participant-role.enum';

@Entity('roomParticipants')
export class RoomParticipant {
  @ApiProperty({ example: 1, description: '참가자 레코드 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '참여 중인 방 정보', type: () => Room })
  @ManyToOne(() => Room, (room) => room.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @ApiProperty({ description: '참여 유저 정보', type: () => Users })
  @ManyToOne(() => Users, (user) => user.roomParticipants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ApiProperty({
    description: '방 내 역할 (HOST / MEMBER)',
    enum: RoomParticipantRole,
    example: RoomParticipantRole.MEMBER,
  })
  @Column({
    type: 'enum',
    enum: RoomParticipantRole,
    default: RoomParticipantRole.MEMBER,
  })
  role: RoomParticipantRole;

  @ApiProperty({
    example: '2025-11-15T12:34:56.000Z',
    description: '방에 참가한 시각',
  })
  @CreateDateColumn({ name: 'joined_at', type: 'timestamp' })
  joinedAt: Date;
}
