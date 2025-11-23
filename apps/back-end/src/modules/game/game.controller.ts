import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GameService } from './game.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guard/access-token.guard';
import type { AuthenticatedRequest } from 'src/common/type/request.type';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiOperation({ summary: '숫자 야구 번호 설정' })
  @ApiCreatedResponse({ description: '설정 성공' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: '존재하지 않는 방입니다.' })
  async setNumbers(
    @Param('id', ParseIntPipe) roomId: number,
    @Req() req: AuthenticatedRequest,
    @Body() body: { numbers: number[] },
  ) {
    const userId = req.user['sub'];
    return await this.gameService.setNumbers(
      roomId,
      Number(userId),
      body.numbers,
    );
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiOperation({ summary: '숫자 야구 번호 반환' })
  @ApiOkResponse({ description: '반환 성공', example: [1, 2, 3, 4] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: '존재하지 않는 방입니다.' })
  async getNumbers(
    @Param('id', ParseIntPipe) roomId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user['sub'];

    return await this.gameService.getNumbers(roomId, Number(userId));
  }

  @Post(':id/guess')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiOperation({ summary: '숫자 야구 추측 결과 반환' })
  @ApiCreatedResponse({
    description: '추측 성공',
    example: { strike: 1, ball: 1, out: 2 },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: '존재하지 않는 방입니다.' })
  @ApiBadRequestResponse({ description: '숫자 4개를 입력해야 합니다.' })
  async guess(
    @Param('id', ParseIntPipe) roomId: number,
    @Body() body: { enemyId: number; numbers: number[] },
  ) {
    return await this.gameService.guess(roomId, body.enemyId, body.numbers);
  }

  @Post(':id/start')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiOperation({ summary: '게임 시작 초기화' })
  @ApiCreatedResponse({ description: '시작 성공' })
  async startGame(@Param('id', ParseIntPipe) roomId: number) {
    return await this.gameService.startGame(roomId);
  }

  @Get(':id/state')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiOperation({ summary: '게임 상태 조회' })
  @ApiOkResponse({ description: '상태 반환' })
  async getState(@Param('id', ParseIntPipe) roomId: number) {
    return await this.gameService.getState(roomId);
  }
}
