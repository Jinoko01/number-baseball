import { ApiProperty } from '@nestjs/swagger';
import { Room } from '../../entities/room.entity';

export class PaginatedRoomResponse {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 37 })
  total: number;

  @ApiProperty({ example: 4 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNext: boolean;

  @ApiProperty({ example: false })
  hasPrev: boolean;

  @ApiProperty({ type: [Room] })
  items: Room[];
}
