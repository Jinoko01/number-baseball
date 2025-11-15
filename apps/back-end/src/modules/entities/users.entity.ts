import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Room } from './room.entity';
import { RoomParticipant } from './room-participant.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  nickname: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  avatar: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  provider: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  refreshToken?: string;

  @ManyToMany(() => Room, (room) => room.participants)
  rooms: Room[];

  @OneToMany(() => RoomParticipant, (rp) => rp.user)
  roomParticipants: RoomParticipant[];
}
