import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { GetRoomsQueryDto } from './dto/get-rooms-query.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from '../entities/room.entity';

describe('RoomController', () => {
  let controller: RoomController;
  let service: jest.Mocked<RoomService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [
        {
          provide: RoomService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RoomController>(RoomController);
    service = module.get(RoomService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should delegate to RoomService.create', async () => {
      const dto: CreateRoomDto = {
        title: 'test room',
      } as unknown as CreateRoomDto;
      const room: Room = { id: 1, title: 'test room' } as Room;

      service.create.mockResolvedValue(room);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(room);
    });
  });

  describe('findAll', () => {
    it('should delegate to RoomService.findAll with query dto', async () => {
      const query: GetRoomsQueryDto = {
        page: 1,
        limit: 10,
      } as unknown as GetRoomsQueryDto;
      const response = {
        items: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10,
      };

      service.findAll.mockResolvedValue(response as any);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(response);
    });
  });

  describe('findOne', () => {
    it('should delegate to RoomService.findOne', async () => {
      const room: Room = { id: 1, title: 'room1' } as Room;
      service.findOne.mockResolvedValue(room);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(room);
    });
  });

  describe('update', () => {
    it('should delegate to RoomService.update', async () => {
      const dto: UpdateRoomDto = {
        title: 'updated',
      } as unknown as UpdateRoomDto;
      const updatedRoom: Room = { id: 1, title: 'updated' } as Room;

      service.update.mockResolvedValue(updatedRoom);

      const result = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updatedRoom);
    });
  });

  describe('remove', () => {
    it('should delegate to RoomService.remove', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
