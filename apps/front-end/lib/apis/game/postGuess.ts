import { fetchUtil } from '@/lib/utils/fetchUtil';
import { API_ROUTE_URL } from '@/lib/constants/api';

interface PostGuessBody {
  roomId: number;
  enemyId: number;
  numbers: number[];
  headers?: HeadersInit;
}

export async function postGuess({ roomId, enemyId, numbers, headers }: PostGuessBody) {
  return await fetchUtil({
    url: `${API_ROUTE_URL}/game/${roomId}/guess`,
    method: 'POST',
    headers,
    body: { enemyId, numbers },
  });
}
