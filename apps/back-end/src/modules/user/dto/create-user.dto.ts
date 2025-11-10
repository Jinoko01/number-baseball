import { IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(20)
  readonly nickname: string;

  @IsString()
  @MaxLength(20)
  readonly name: string;

  @IsString()
  readonly avatar: string;

  @IsString()
  readonly provider: string;
}
