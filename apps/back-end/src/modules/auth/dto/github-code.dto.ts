import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GithubCodeDto {
  @ApiProperty({
    example: 'z23f2fgargheghq3r',
    description: '깃허브 Oauth에서 발급받은 code',
  })
  @IsString()
  readonly code: string;
}
