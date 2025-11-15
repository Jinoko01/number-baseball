import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  RelationId,
  OneToMany,
} from 'typeorm';
import { RoomParticipant } from './room-participant.entity';

@Entity()
export class Room {
  @ApiProperty({ example: 1, description: '방 ID' })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({
    example: '우테코 숫자야구',
    maxLength: 30,
    description: '방 제목',
  })
  @Column({ type: 'varchar', length: 30, nullable: false })
  title: string;

  @ApiProperty({ example: 2, description: '수용 인원' })
  @Column({ type: 'int', nullable: false, default: 2 })
  capacity: number;

  @ApiProperty({ example: 1, minimum: 1, maximum: 2, description: '현재 인원' })
  @Column({ type: 'int', nullable: false })
  currentCount: number;

  @ApiProperty({
    description: '방 참가자 목록 (역할 포함)',
    type: () => [RoomParticipant],
  })
  @OneToMany(() => RoomParticipant, (rp) => rp.room)
  participants: RoomParticipant[];

  @ApiProperty({
    description: '방 참가자 ID 목록',
    example: [1, 3],
    type: [Number],
  })
  @RelationId((room: Room) => room.participants)
  participantIds: number[];

  @ApiProperty({
    example: '2025-11-09T12:34:56.000Z',
    description: '생성 시각',
  })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
