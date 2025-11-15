'use server';

import { getHeaders } from '@/app/api/getHeaders';
import { getCookie } from '../utils/next-cookie';
import { patchJoinRoom } from '../apis/room/patchJoinRoom';
import { redirect } from 'next/navigation';

export async function joinRoomAction(roomId: number) {
  const accessToken = await getCookie('accessToken');
  const headers = getHeaders(accessToken);

  const result = await patchJoinRoom({ id: roomId, headers });
  if (result) {
    redirect(`/room/${roomId}`);
  }
}
