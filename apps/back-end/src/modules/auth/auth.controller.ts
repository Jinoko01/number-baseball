import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubCodeDto } from './dto/github-code.dto';
import { AccessTokenGuard } from 'src/common/guard/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guard/refresh-token.guard';
import type { AuthenticatedRequest } from 'src/common/type/requestType';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('github')
  githubSignIn(@Body() githubCodeDto: GithubCodeDto) {
    return this.authService.githubSignIn(githubCodeDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('signout')
  signout(@Req() req: AuthenticatedRequest) {
    const userId = req.user['sub'];
    this.authService.signOut(Number(userId));
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshAllTokens(@Req() req: AuthenticatedRequest) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];

    return this.authService.refreshAllTokens(Number(userId), refreshToken);
  }
}
