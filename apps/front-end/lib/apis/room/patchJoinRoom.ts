import { fetchUtil } from 'utils';
import { API_ROUTE_URL } from '../../constants/api';
import type { Room } from 'utils';

interface PatchJoinRoomBody {
  id: number;
  headers?: HeadersInit;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PatchJoinRoomResponse extends Room {}

export async function patchJoinRoom({
  id,
  headers,
}: PatchJoinRoomBody): Promise<PatchJoinRoomResponse> {
  return await fetchUtil({
    url: `${API_ROUTE_URL}/room/${id}/join`,
    method: 'PATCH',
    headers,
    body: { id },
  });
}
