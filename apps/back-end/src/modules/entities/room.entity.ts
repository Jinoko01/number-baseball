import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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
  @Column({ type: 'varchar', nullable: false })
  currentCount: number;

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
