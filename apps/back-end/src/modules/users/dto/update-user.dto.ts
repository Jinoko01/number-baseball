import { PartialType } from '@nestjs/mapped-types';
import { IsString, MaxLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MaxLength(20)
  readonly nickname?: string;

  @IsString()
  @MaxLength(20)
  readonly name?: string;

  @IsString()
  readonly avatar?: string;

  @IsString()
  readonly refreshToken?: string;
}
