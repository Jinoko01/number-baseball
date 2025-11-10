import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @ApiProperty({ example: '수정된 숫자 야구 제목', description: '방 제목' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  title?: string;

  @ApiProperty({ example: 1, description: '현재 인원' })
  @IsOptional()
  @IsInt()
  @Min(1)
  currentCount?: number;
}
