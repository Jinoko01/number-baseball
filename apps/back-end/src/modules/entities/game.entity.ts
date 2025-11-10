import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  participants: Users[];

  @ManyToOne(() => Users, { nullable: true, onDelete: 'SET NULL' })
  winner: Users | null;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;
}
