import { ApiProperty } from '@nestjs/swagger';

export class HomeMessageDto {
  @ApiProperty({
    example: '안녕하세요',
    description:
      '/home 페이지에서 전송할 채팅 메시지를 입력합니다. homeMessage를 구독합니다.',
  })
  message: string;
}
