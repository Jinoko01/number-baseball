import { API_ROUTE_URL } from '@/lib/constants/api';
import type { Room } from 'utils';
import { fetchUtil } from 'utils';

interface GetRoomsQuery {
  page?: number;
  limit?: number;
  headers?: HeadersInit;
}

interface GetRoomsResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  items: Room[];
}

export async function getRooms({
  page = 1,
  limit = 10,
  headers,
}: GetRoomsQuery): Promise<GetRoomsResponse> {
  return await fetchUtil({
    url: `${API_ROUTE_URL}/room?page=${page}&limit=${limit}`,
    method: 'GET',
    headers,
  });
}
