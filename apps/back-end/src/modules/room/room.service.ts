import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { DataSource, Repository } from 'typeorm';
import { GetRoomsQueryDto } from './dto/get-rooms-query.dto';
import { PaginatedRoomResponse } from './dto/pagenated-room-response.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = this.roomRepository.create({
      title: createRoomDto.title,
      capacity: 2,
      currentCount: 1,
    });
    return await this.roomRepository.save(room);
  }

  async findAll(query: GetRoomsQueryDto): Promise<PaginatedRoomResponse> {
    const page = query.page ?? 1;
    const rawLimit = query.limit ?? 10;
    const limit = Math.min(Math.max(rawLimit, 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await this.roomRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const totalPages = Math.max(Math.ceil(total / limit), 1);
    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      items,
    };
  }

  async findOne(id: number): Promise<Room | null> {
    const room = await this.roomRepository.findOne({ where: { id } });
    return room;
  }

  async joinRoom(id: number) {
    return this.dataSource.transaction(async (manager) => {
      const updateResult = await manager
        .createQueryBuilder()
        .update(Room)
        .set({
          currentCount: () => `"currentCount" + 1`,
        })
        .where('id = :id', { id })
        .andWhere(`"currentCount" < "capacity"`)
        .returning('*')
        .execute();

      if (updateResult.affected === 0) {
        const room = await manager.findOne(Room, { where: { id } });

        if (!room) {
          throw new NotFoundException('존재하지 않는 방입니다.');
        }

        throw new BadRequestException('방이 꽉 찼습니다.');
      }

      const updatedRoom = updateResult.raw[0] as Room;
      return updatedRoom;
    });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room | null> {
    const result = await this.roomRepository.update(id, updateRoomDto);

    if (result.affected === 0) {
      throw new NotFoundException(`존재하지 않는 방입니다.`);
    }

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.roomRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`존재하지 않는 방입니다..`);
    }
  }
}
