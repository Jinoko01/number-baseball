import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubCodeDto } from './dto/github-code.dto';
import { AccessTokenGuard } from 'src/common/guard/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guard/refresh-token.guard';
import type { AuthenticatedRequest } from 'src/common/type/request.type';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('github')
  @ApiOperation({ summary: '깃허브 Oauth 로그인' })
  @ApiOkResponse({
    description: '로그인 성공',
    example: { accessToken: 'string', refreshToken: 'string' },
  })
  @ApiBadRequestResponse({ description: '잘못된 요청' })
  githubSignIn(@Body() githubCodeDto: GithubCodeDto) {
    return this.authService.githubSignIn(githubCodeDto);
  }

  @Get('signout')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '로그아웃' })
  @ApiBearerAuth('accessToken')
  @ApiOkResponse({ description: '로그아웃 성공' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  signout(@Req() req: AuthenticatedRequest) {
    const userId = req.user['sub'];
    this.authService.signOut(Number(userId));
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: '토큰 갱신' })
  @ApiBearerAuth('refreshToken')
  @ApiOkResponse({
    description: '토큰 갱신 성공',
    example: { accessToken: 'string', refreshToken: 'string' },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  refreshAllTokens(@Req() req: AuthenticatedRequest) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];

    return this.authService.refreshAllTokens(Number(userId), refreshToken);
  }
}
