import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetRoomsQueryDto {
  @ApiPropertyOptional({ example: 1, description: '페이지(1부터 시작)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, description: '페이지 크기(1~100 권장)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
