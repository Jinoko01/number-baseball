import { fetchUtil } from '@/lib/utils/fetchUtil';
import { API_ROUTE_URL } from '@/lib/constants/api';

export interface GameLastResult {
  enemyId: number;
  guess: number[];
  strike: number;
  ball: number;
  out: number;
  at: number;
}

export interface GameStateResponse {
  state: 'waiting' | 'in_progress' | 'finished';
  turn?: number | null;
  winner?: number | null;
  lastResult?: GameLastResult | null;
}

export async function getGameState(roomId: number): Promise<GameStateResponse> {
  return await fetchUtil({
    url: `${API_ROUTE_URL}/game/${roomId}/state`,
    method: 'GET',
  });
}
