import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Room } from '../entities/room.entity';
import { GetRoomsQueryDto } from './dto/get-rooms-query.dto';
import { PaginatedRoomResponse } from './dto/pagenated-room-response.dto';

@ApiTags('room')
// @ApiBearerAuth()
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: '방 생성' })
  @ApiCreatedResponse({ description: '생성 성공', type: Room })
  @ApiBadRequestResponse({ description: '유효성 오류' })
  async create(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return await this.roomService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: '방 목록(페이지네이션)' })
  @ApiOkResponse({
    description: '페이지네이션 목록 응답',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedRoomResponse) },
        {
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 37 },
            totalPages: { type: 'number', example: 4 },
            hasNext: { type: 'boolean', example: true },
            hasPrev: { type: 'boolean', example: false },
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(Room) },
            },
          },
        },
      ],
    },
  })
  async findAll(
    @Query() query: GetRoomsQueryDto,
  ): Promise<PaginatedRoomResponse> {
    return await this.roomService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '방 상세 조회' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: '조회 성공', type: Room })
  @ApiNotFoundResponse({ description: '존재하지 않는 방' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Room | null> {
    return await this.roomService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '방 정보 수정' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: '수정 성공', type: Room })
  @ApiBadRequestResponse({ description: '유효성 오류' })
  @ApiNotFoundResponse({ description: '존재하지 않는 방' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoomDto,
  ): Promise<Room | null> {
    return await this.roomService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '방 삭제' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: '삭제 성공' })
  @ApiNotFoundResponse({ description: '존재하지 않는 방' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.roomService.remove(id);
  }
}
