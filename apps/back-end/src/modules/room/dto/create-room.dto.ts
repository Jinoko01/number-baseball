import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    example: '우테코 숫자야구',
    maxLength: 30,
    description: '방 제목',
  })
  @IsString()
  @MaxLength(30)
  readonly title: string;
}
