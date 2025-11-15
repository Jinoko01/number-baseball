import { API_ROUTE_URL } from '@/lib/constants/api';
import { fetchUtil } from 'utils';

interface GetRoomRequest {
  roomId: number;
  headers?: HeadersInit;
}

export async function getRoomById({ roomId, headers }: GetRoomRequest) {
  return await fetchUtil({
    url: `${API_ROUTE_URL}/room/${roomId}`,
    method: 'GET',
    headers,
  });
}
