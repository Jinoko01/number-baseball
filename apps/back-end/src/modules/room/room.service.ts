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
import { Users } from '../entities/users.entity';
import { RoomParticipant } from '../entities/room-participant.entity';
import { RoomParticipantRole } from 'src/common/enum/room-participant-role.enum';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(RoomParticipant)
    private readonly roomParticipant: Repository<RoomParticipant>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = this.roomRepository.create({
      title: createRoomDto.title,
      capacity: 2,
      currentCount: 0,
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
      relations: {
        participants: {
          user: true,
        },
      },
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
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: {
        participants: {
          user: true,
        },
      },
    });
    return room;
  }

  async getParticipants(roomId: number) {
    const participants = await this.roomParticipant.find({
      where: { room: { id: roomId } },
      relations: ['user'],
    });
    return participants;
  }

  async joinRoom(roomId: number, userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    return this.dataSource.transaction(async (manager) => {
      const roomRepo = manager.getRepository(Room);
      const participantRepo = manager.getRepository(RoomParticipant);

      const room = await roomRepo
        .createQueryBuilder('room')
        .setLock('pessimistic_write')
        .where('room.id = :roomId', { roomId })
        .getOne();

      if (!room) {
        throw new NotFoundException('존재하지 않는 방입니다.');
      }

      const participants = await participantRepo.find({
        where: { room: { id: roomId } },
        relations: ['user'],
      });

      const alreadyJoined = participants.some(
        (participant) => participant.user.id === userId,
      );
      if (alreadyJoined) {
        throw new BadRequestException('이미 해당 방에 참가 중인 사용자입니다.');
      }

      if (room.currentCount >= room.capacity) {
        throw new BadRequestException('방이 꽉 찼습니다.');
      }

      const role =
        participants.length === 0
          ? RoomParticipantRole.HOST
          : RoomParticipantRole.MEMBER;

      room.currentCount += 1;
      await roomRepo.save(room);

      const roomParticipant = participantRepo.create({
        room,
        user,
        role,
      });
      await participantRepo.save(roomParticipant);

      const updatedRoom = await roomRepo.findOne({
        where: { id: roomId },
        relations: ['participants', 'participants.user'],
      });

      return updatedRoom;
    });
  }

  async leaveRoom(roomId: number, userId: number) {
    return this.dataSource.transaction(async (manager) => {
      const roomRepo = manager.getRepository(Room);
      const participantRepo = manager.getRepository(RoomParticipant);

      const room = await roomRepo
        .createQueryBuilder('room')
        .setLock('pessimistic_write')
        .where('room.id = :roomId', { roomId })
        .getOne();

      if (!room) {
        throw new NotFoundException('존재하지 않는 방입니다.');
      }

      const participants = await participantRepo.find({
        where: { room: { id: roomId } },
        relations: ['user'],
      });

      const leavingParticipant = participants.find(
        (participant) => participant.user.id === userId,
      );

      if (!leavingParticipant) {
        throw new BadRequestException('해당 방에 참가 중인 사용자가 아닙니다.');
      }

      const leavingWasHost =
        leavingParticipant.role === RoomParticipantRole.HOST;

      await participantRepo.delete({ id: leavingParticipant.id });

      room.currentCount = Math.max(0, room.currentCount - 1);
      await roomRepo.save(room);

      if (leavingWasHost) {
        const remainingParticipants = await participantRepo.find({
          where: { room: { id: roomId } },
          relations: ['user'],
          order: { joinedAt: 'ASC' },
        });

        if (remainingParticipants.length > 0) {
          const newHost = remainingParticipants[0];
          newHost.role = RoomParticipantRole.HOST;
          await participantRepo.save(newHost);
        }
      }

      const updatedRoom = await roomRepo.findOne({
        where: { id: roomId },
        relations: ['participants', 'participants.user'],
      });

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
