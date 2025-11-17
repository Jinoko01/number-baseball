'use server';

import { getHeaders } from '@/app/api/getHeaders';
import { getCookie } from '../utils/next-cookie';
import { postJoinRoom } from '../apis/room/postJoinRoom';
import { redirect } from 'next/navigation';

export async function leaveRoomAction(roomId: number) {
  const accessToken = await getCookie('accessToken');
  const headers = getHeaders(accessToken);

  const result = await postJoinRoom({ id: roomId, headers });
  if (result) {
    redirect(`/room/${roomId}`);
  }
}
