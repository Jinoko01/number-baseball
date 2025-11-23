import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class GameService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async setNumbers(
    roomId: number,
    userId: number,
    numbers: number[],
  ): Promise<number[]> {
    const setNumbersCacheKey = `numbers:${roomId}:${userId}`;
    return await this.cacheManager.set(setNumbersCacheKey, numbers);
  }

  async getNumbers(
    roomId: number,
    userId: number,
  ): Promise<number[] | null | undefined> {
    const getNumbersCacheKey = `numbers:${roomId}:${userId}`;
    return await this.cacheManager.get(getNumbersCacheKey);
  }

  async guess(
    roomId: number,
    enemyId: number,
    numbers: number[],
  ): Promise<{ strike: number; ball: number; out: number }> {
    const enemyNumbers: number[] | null | undefined = await this.getNumbers(
      roomId,
      enemyId,
    );
    let strike = 0;
    let ball = 0;
    let out = 0;

    if (!enemyNumbers) {
      throw new Error('상대방의 숫자가 설정되지 않았습니다.');
    }

    enemyNumbers.forEach((number, index) => {
      if (number === numbers[index]) {
        strike += 1;
      } else if (enemyNumbers.includes(numbers[index])) {
        ball += 1;
      } else {
        out += 1;
      }
    });

    return { strike, ball, out };
  }
}
