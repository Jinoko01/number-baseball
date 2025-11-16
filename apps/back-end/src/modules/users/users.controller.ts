import { Controller, UseGuards, Get, Req, Delete } from '@nestjs/common';
import UsersService from './users.service';
import { AccessTokenGuard } from 'src/common/guard/access-token.guard';
import { Users } from '../entities/users.entity';
import type { AuthenticatedRequest } from 'src/common/type/request.type';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiOkResponse({
    description: '내 정보 조회 성공',
    type: Users,
    example: {
      id: 1,
      nickname: 'Jinoko01',
      avatar: 'http://어쩌고.저쩌고/깃허브/프로필/이미지링크',
      refreshToken: undefined,
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getMe(@Req() req: AuthenticatedRequest) {
    const userId = req.user['sub'];
    const user = await this.usersService.findById(Number(userId));

    return this.shieldUserInformation(user);
  }

  @Delete('me')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '내 정보 삭제' })
  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiOkResponse({ description: '내 정보 삭제 성공' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Req() req: AuthenticatedRequest) {
    return this.usersService.remove(Number(req.user['sub']));
  }

  private shieldUserInformation(user: Users | null) {
    return { ...user, refreshToken: undefined };
  }
}
