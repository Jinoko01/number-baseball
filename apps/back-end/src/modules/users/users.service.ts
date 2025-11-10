import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const createdUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(createdUser);
  }

  async findAll(): Promise<Users[]> {
    return await this.usersRepository.find();
  }

  async findById(userId: number): Promise<Users | null> {
    return await this.usersRepository.findOne({ where: { id: userId } });
  }

  async findByNickname(nickname: string): Promise<Users | null> {
    return await this.usersRepository.findOne({ where: { nickname } });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Users | null> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
