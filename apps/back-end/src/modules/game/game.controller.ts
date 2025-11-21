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
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
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
  async setNumbers(
    @Param('id', ParseIntPipe) roomId: number,
    @Body() body: { userId: number; numbers: number[] },
  ) {
    return await this.gameService.setNumbers(roomId, body.userId, body.numbers);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
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
  async guess(
    @Param('id', ParseIntPipe) roomId: number,
    @Body() body: { enemyId: number; numbers: number[] },
  ) {
    return await this.gameService.guess(roomId, body.enemyId, body.numbers);
  }
}
