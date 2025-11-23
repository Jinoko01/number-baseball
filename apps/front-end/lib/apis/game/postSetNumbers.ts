import { fetchUtil } from '@/lib/utils/fetchUtil';
import { API_ROUTE_URL } from '@/lib/constants/api';

interface PostSetNumbersBody {
  roomId: number;
  numbers: number[];
  headers?: HeadersInit;
}

export async function postSetNumbers({ roomId, numbers, headers }: PostSetNumbersBody) {
  return await fetchUtil({
    url: `${API_ROUTE_URL}/game/${roomId}`,
    method: 'POST',
    headers,
    body: { numbers },
  });
}
