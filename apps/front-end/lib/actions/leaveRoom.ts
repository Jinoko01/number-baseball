'use server';

import { getHeaders } from '@/app/api/getHeaders';
import { getCookie } from '../utils/next-cookie';
import { redirect } from 'next/navigation';
import { postLeaveRoom } from '../apis/room/postLeaveRoom';

export async function leaveRoomAction(roomId: number) {
  const accessToken = await getCookie('accessToken');
  const headers = getHeaders(accessToken);

  const result = await postLeaveRoom({ id: roomId, headers });
  if (result) {
    redirect(`/room/${roomId}`);
  }
}
