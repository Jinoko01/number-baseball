'use server';

import { postCreateRoom } from '@/lib/apis/room/postCreateRoom';
import { getCookie } from '../utils/next-cookie';
import { getHeaders } from '@/app/api/getHeaders';
import { redirect } from 'next/navigation';
import { postJoinRoom } from '../apis/room/postJoinRoom';

export async function createRoomAction(formData: FormData) {
  const accessToken = await getCookie('accessToken');
  const headers = getHeaders(accessToken);

  const title = formData.get('roomName');
  const room = await postCreateRoom({ title: title as string, headers });
  await postJoinRoom({ id: room.id, headers });
  redirect(`/room/${room.id}`);
}
