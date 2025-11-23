import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { RoomService } from '../room/room.service';

@Injectable()
export class GameService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly roomService: RoomService,
  ) {}

  private buildNumberKey(roomId: number, userId: number) {
    return `number${roomId}:${userId}`;
  }

  private buildTurnKey(roomId: number) {
    return `turn:${roomId}`;
  }

  private buildStateKey(roomId: number) {
    return `state:${roomId}`;
  }

  private buildWinnerKey(roomId: number) {
    return `winner:${roomId}`;
  }

  private buildLastResultKey(roomId: number) {
    return `lastResult:${roomId}`;
  }

  private validateNumbers(numbers: number[]) {
    if (!Array.isArray(numbers) || numbers.length !== 4) {
      throw new BadRequestException('숫자 4개를 입력해야 합니다.');
    }
    const allDigits = numbers.every(
      (n) => Number.isInteger(n) && n >= 0 && n <= 9,
    );
    if (!allDigits) {
      throw new BadRequestException('각 숫자는 0~9의 정수여야 합니다.');
    }
    const unique = new Set(numbers);
    if (unique.size !== 4) {
      throw new BadRequestException('중복되지 않는 4자리 숫자여야 합니다.');
    }
  }

  async setNumbers(
    roomId: number,
    userId: number,
    numbers: number[],
  ): Promise<{ ok: true }> {
    this.validateNumbers(numbers);
    const key = this.buildNumberKey(roomId, userId);
    await this.cacheManager.set(key, numbers, 60 * 60 * 24);

    const participants = await this.roomService.getParticipants(roomId);
    const userIds = participants.map((p) => p.user.id);
    const allSet = await Promise.all(
      userIds.map((id) =>
        this.cacheManager.get<number[]>(this.buildNumberKey(roomId, id)),
      ),
    );

    const stateKey = this.buildStateKey(roomId);
    const turnKey = this.buildTurnKey(roomId);

    if (allSet.every((v) => Array.isArray(v) && v.length === 4)) {
      const host = participants.find((p) => p.role === 'HOST' || p.role === 0);
      const firstTurnUserId = host?.user?.id ?? userIds[0];
      await this.cacheManager.set(stateKey, 'in_progress', 60 * 60 * 24);
      await this.cacheManager.set(turnKey, firstTurnUserId, 60 * 60 * 24);
    }

    return { ok: true };
  }

  async getNumbers(
    roomId: number,
    userId: number,
  ): Promise<number[] | null | undefined> {
    const key = this.buildNumberKey(roomId, userId);
    return await this.cacheManager.get<number[]>(key);
  }

  private computeResult(secret: number[], guess: number[]) {
    let strike = 0;
    let ball = 0;
    let out = 0;
    for (let i = 0; i < 4; i++) {
      if (secret[i] === guess[i]) strike++;
      else if (secret.includes(guess[i])) ball++;
      else out++;
    }
    return { strike, ball, out } as const;
  }

  async guess(
    roomId: number,
    enemyId: number,
    numbers: number[],
  ): Promise<{
    strike: number;
    ball: number;
    out: number;
    winner?: number;
    nextTurn?: number;
  }> {
    this.validateNumbers(numbers);

    const stateKey = this.buildStateKey(roomId);
    const state = (await this.cacheManager.get<string>(stateKey)) || 'waiting';
    if (state !== 'in_progress') {
      throw new BadRequestException('게임이 진행 중이 아닙니다.');
    }

    const enemyNumbers = await this.getNumbers(roomId, enemyId);
    if (!enemyNumbers) {
      throw new BadRequestException('상대방의 숫자가 설정되지 않았습니다.');
    }

    const result = this.computeResult(enemyNumbers, numbers);

    const lastResultKey = this.buildLastResultKey(roomId);
    await this.cacheManager.set(
      lastResultKey,
      { enemyId, guess: numbers, ...result, at: Date.now() },
      60 * 60 * 24,
    );

    if (result.strike === 4) {
      const winnerKey = this.buildWinnerKey(roomId);
      await this.cacheManager.set(
        winnerKey,
        enemyId === undefined ? null : undefined,
        60 * 60 * 24,
      );
    }

    const turnKey = this.buildTurnKey(roomId);
    const currentTurn = await this.cacheManager.get<number>(turnKey);
    let nextTurn: number | undefined = undefined;

    if (result.strike === 4) {
      const winnerKey = this.buildWinnerKey(roomId);
      const winner = currentTurn ?? null;
      await this.cacheManager.set(
        this.buildStateKey(roomId),
        'finished',
        60 * 60 * 24,
      );
      await this.cacheManager.set(winnerKey, winner, 60 * 60 * 24);
      return { ...result, winner: winner ?? undefined };
    } else {
      const participants = await this.roomService.getParticipants(roomId);
      const userIds = participants.map((p) => p.user.id);
      nextTurn = userIds.find((id) => id !== currentTurn);
      if (nextTurn) {
        await this.cacheManager.set(turnKey, nextTurn, 60 * 60 * 24);
      }
      return { ...result, nextTurn };
    }
  }

  async startGame(roomId: number) {
    const participants = await this.roomService.getParticipants(roomId);
    if (participants.length !== 2) {
      throw new BadRequestException('두 플레이어가 모두 입장해야 합니다.');
    }
    const host = participants.find((p) => p.role === 'HOST' || p.role === 0);
    const firstTurnUserId = host?.user?.id ?? participants[0].user.id;
    await this.cacheManager.set(
      this.buildStateKey(roomId),
      'waiting',
      60 * 60 * 24,
    );
    await this.cacheManager.set(
      this.buildTurnKey(roomId),
      firstTurnUserId,
      60 * 60 * 24,
    );

    return { roomId, state: 'waiting', turn: firstTurnUserId };
  }

  async getState(roomId: number) {
    const state =
      (await this.cacheManager.get<string>(this.buildStateKey(roomId))) ||
      'waiting';
    const turn = await this.cacheManager.get<number>(this.buildTurnKey(roomId));
    const winner = await this.cacheManager.get<number>(
      this.buildWinnerKey(roomId),
    );
    const lastResult = await this.cacheManager.get<any>(
      this.buildLastResultKey(roomId),
    );
    return { state, turn, winner, lastResult };
  }
}
