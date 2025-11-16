import { ApiProperty } from '@nestjs/swagger';

export class RoomMessageDto {
  @ApiProperty({ example: 1, description: '방 ID를 입력합니다.' })
  roomId: number;

  @ApiProperty({
    example: '안녕하세요',
    description:
      '방 ID에 대해 전송할 채팅 메시지를 입력합니다. roomMessage를 구독합니다.',
  })
  message: string;
}
