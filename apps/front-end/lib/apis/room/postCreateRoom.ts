import { fetchUtil } from '@/lib/utils/fetchUtil';
import { API_ROUTE_URL } from '../../constants/api';
import type { Room } from 'utils';

interface PostCreateRoomBody {
  title: string;
  headers?: HeadersInit;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PostCreateRoomResponse extends Room {}

export async function postCreateRoom({
  title,
  headers,
}: PostCreateRoomBody): Promise<PostCreateRoomResponse> {
  return await fetchUtil({
    url: `${API_ROUTE_URL}/room`,
    method: 'POST',
    headers,
    body: { title },
  });
}
