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
  UseGuards,
  Req,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Room } from '../entities/room.entity';
import { GetRoomsQueryDto } from './dto/get-rooms-query.dto';
import { PaginatedRoomResponse } from './dto/pagenated-room-response.dto';
import { AccessTokenGuard } from 'src/common/guard/access-token.guard';
import type { AuthenticatedRequest } from 'src/common/type/request.type';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiOperation({ summary: '방 생성' })
  @ApiCreatedResponse({ description: '생성 성공', type: Room })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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

  @Post(':id/join')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiOperation({ summary: '방 참여' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: '참여 성공', type: Room })
  @ApiBadRequestResponse({ description: '방이 꽉 찼습니다.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: '존재하지 않는 방입니다.' })
  async joinRoom(
    @Param('id', ParseIntPipe) roomId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Room | null> {
    const userId = req.user['sub'];
    return await this.roomService.joinRoom(roomId, Number(userId));
  }

  @Post(':id/leave')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiOperation({
    summary: '방 나가기',
    description:
      '사용자가 방에서 나갑니다. HOST가 나갈 경우, 남아 있는 참가자 중 가장 먼저 입장한 사용자에게 HOST 역할을 재할당합니다.',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({
    description:
      '퇴장 처리 후 최신 방 정보 (참가자/역할 포함). 남은 인원이 없다면 participants는 빈 배열이 됩니다.',
    type: Room,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: '존재하지 않는 방입니다.' })
  @ApiBadRequestResponse({
    description: '해당 방에 참가 중인 사용자가 아닙니다.',
  })
  async leaveRoom(
    @Param('id', ParseIntPipe) roomId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Room | { message: string } | null> {
    const userId = req.user['sub'];
    return await this.roomService.leaveRoom(roomId, Number(userId));
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiOperation({ summary: '방 정보 수정' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: '수정 성공', type: Room })
  @ApiBadRequestResponse({ description: '잘못된 요청' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: '존재하지 않는 방' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoomDto,
  ): Promise<Room | null> {
    return await this.roomService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiOperation({ summary: '방 삭제' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: '삭제 성공' })
  @ApiNotFoundResponse({ description: '존재하지 않는 방' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.roomService.remove(id);
  }
}
