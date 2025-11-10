import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
