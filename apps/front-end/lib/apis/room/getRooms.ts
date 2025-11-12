import { API_ROUTE_URL } from '@/lib/constants/api';
import type { Room } from '@/lib/types/Room';
import { fetchUtil } from 'utils';

interface GetRoomsResponse {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  items: Room[];
}

export async function getRooms(): Promise<GetRoomsResponse> {
  return await fetchUtil({
    url: `${API_ROUTE_URL}/room`,
    method: 'GET',
  });
}
