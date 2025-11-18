import { API_ROUTE_URL } from '@/lib/constants/api';
import { fetchUtil } from 'utils';
import type { Room } from 'utils';

interface GetRoomRequest {
  roomId: number;
  headers?: HeadersInit;
}

export async function getRoomById({ roomId, headers }: GetRoomRequest): Promise<Room> {
  return await fetchUtil({
    url: `${API_ROUTE_URL}/room/${roomId}`,
    method: 'GET',
    headers,
    tags: [`room:${roomId}`],
  });
}
