import { fetchUtil } from 'utils';
import { API_ROUTE_URL } from '../../constants/api';
import type { Room } from 'utils';

interface PostJoinRoomBody {
  id: number;
  headers?: HeadersInit;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PostJoinRoomResponse extends Room {}

export async function postJoinRoom({
  id,
  headers,
}: PostJoinRoomBody): Promise<PostJoinRoomResponse> {
  return await fetchUtil({
    url: `${API_ROUTE_URL}/room/${id}/join`,
    method: 'POST',
    headers,
  });
}
