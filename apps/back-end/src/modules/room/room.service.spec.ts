import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { GetRoomsQueryDto } from './dto/get-rooms-query.dto';

type MockRepo = Partial<Record<keyof Repository<Room>, jest.Mock>>;

const createMockRepository = (): MockRepo => ({
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('RoomService', () => {
  let service: RoomService;
  let roomRepository: MockRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: getRepositoryToken(Room),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
    roomRepository = module.get<MockRepo>(getRepositoryToken(Room));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(roomRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a room', async () => {
      const dto: any = { title: 'test room' };
      const room: Room = { id: 1, title: 'test room' } as Room;

      (roomRepository.create as jest.Mock).mockReturnValue(room);
      (roomRepository.save as jest.Mock).mockResolvedValue(room);

      const result = await service.create(dto);

      expect(roomRepository.create).toHaveBeenCalledWith(dto);
      expect(roomRepository.save).toHaveBeenCalledWith(room);
      expect(result).toEqual(room);
    });
  });

  describe('findAll', () => {
    it('should return paginated rooms', async () => {
      const query: GetRoomsQueryDto = {
        page: 2,
        limit: 2,
      } as unknown as GetRoomsQueryDto;
      const rooms: Room[] = [
        { id: 3, title: 'room3' } as Room,
        { id: 4, title: 'room4' } as Room,
      ];
      const total = 4;

      (roomRepository.findAndCount as jest.Mock).mockResolvedValue([
        rooms,
        total,
      ]);

      const result = await service.findAll(query);

      expect(roomRepository.findAndCount).toHaveBeenCalled();
      const callArg = (roomRepository.findAndCount as jest.Mock).mock
        .calls[0][0];

      // skip/take 제대로 계산되었는지 대략 체크
      expect(callArg).toMatchObject({
        skip: 2, // (page - 1) * limit = (2 - 1) * 2
        take: 2,
      });

      expect(result.items).toEqual(rooms);
      expect(result.totalItems).toBe(total);
      expect(result.totalPages).toBe(2);
      expect(result.currentPage).toBe(2);
      expect(result.limit).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return a room when found', async () => {
      const room: Room = { id: 1, title: 'room1' } as Room;
      (roomRepository.findOne as jest.Mock).mockResolvedValue(room);

      const result = await service.findOne(1);

      expect(roomRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(room);
    });

    it('should throw NotFoundException when room not found', async () => {
      (roomRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return updated room', async () => {
      const dto: any = { title: 'updated' };
      const updatedRoom: Room = { id: 1, title: 'updated' } as Room;

      (roomRepository.update as jest.Mock).mockResolvedValue({ affected: 1 });
      const findOneSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(updatedRoom);

      const result = await service.update(1, dto);

      expect(roomRepository.update).toHaveBeenCalledWith(1, dto);
      expect(findOneSpy).toHaveBeenCalledWith(1);
      expect(result).toEqual(updatedRoom);
    });

    it('should throw NotFoundException when no row is affected', async () => {
      const dto: any = { title: 'updated' };

      (roomRepository.update as jest.Mock).mockResolvedValue({ affected: 0 });

      await expect(service.update(1, dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete room when exists', async () => {
      (roomRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(roomRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when room not found', async () => {
      (roomRepository.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
