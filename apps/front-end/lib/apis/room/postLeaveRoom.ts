import { fetchUtil } from 'utils';
import { API_ROUTE_URL } from '../../constants/api';
import type { Room } from 'utils';

interface PostLeaveRoomBody {
  id: number;
  headers?: HeadersInit;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PostLeaveRoomResponse extends Room {}

export async function postLeaveRoom({
  id,
  headers,
}: PostLeaveRoomBody): Promise<PostLeaveRoomResponse> {
  return await fetchUtil({
    url: `${API_ROUTE_URL}/room/${id}/leave`,
    method: 'POST',
    headers,
  });
}
