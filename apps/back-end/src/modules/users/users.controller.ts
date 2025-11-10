import { Controller, UseGuards, Get, Req, Delete } from '@nestjs/common';
import UsersService from './users.service';
import { AccessTokenGuard } from 'src/common/guard/access-token.guard';
import { Users } from '../entities/users.entity';
import type { AuthenticatedRequest } from 'src/common/type/requestType';

@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    const userId = req.user['sub'];
    const user = await this.usersService.findById(Number(userId));
    console.log(user);

    return this.shieldUserInformation(user);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('me')
  async remove(@Req() req: AuthenticatedRequest) {
    return this.usersService.remove(Number(req.user['sub']));
  }

  private shieldUserInformation(user: Users | null) {
    return { ...user, refreshToken: undefined };
  }
}
