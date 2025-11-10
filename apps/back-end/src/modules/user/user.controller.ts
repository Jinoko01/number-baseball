import { Controller, UseGuards, Get, Req, Delete } from '@nestjs/common';
import UserService from './user.service';
import { AccessTokenGuard } from 'src/common/guard/access-token.guard';
import { User } from '../entities/user.entity';
import type { AuthenticatedRequest } from 'src/common/type/requestType';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    const userId = req.user['sub'];
    const user = await this.userService.findById(Number(userId));

    return this.shieldUserInformation(user);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('me')
  async remove(@Req() req: AuthenticatedRequest) {
    return this.userService.remove(Number(req.user['sub']));
  }

  private shieldUserInformation(user: User | null) {
    return { ...user, refreshToken: undefined };
  }
}
