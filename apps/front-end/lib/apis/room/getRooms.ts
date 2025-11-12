import { API_ROUTE_URL } from '@/lib/constants/api';
import type { Room } from '@/lib/types/Room';
import { fetchUtil } from 'utils';

interface GetRoomsQuery {
  page?: number;
  limit?: number;
}

interface GetRoomsResponse {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  items: Room[];
}

export async function getRooms({ page = 1, limit = 10 }: GetRoomsQuery): Promise<GetRoomsResponse> {
  return await fetchUtil({
    url: `${API_ROUTE_URL}/room?page=${page}&limit=${limit}`,
    method: 'GET',
  });
}
