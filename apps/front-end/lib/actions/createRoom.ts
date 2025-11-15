'use server';

import { postCreateRoom } from '@/lib/apis/room/postCreateRoom';
import { getCookie } from '../utils/next-cookie';
import { getHeaders } from '@/app/api/getHeaders';
import { redirect } from 'next/navigation';
import { patchJoinRoom } from '../apis/room/patchJoinRoom';

export async function createRoomAction(formData: FormData) {
  const accessToken = await getCookie('accessToken');
  const headers = getHeaders(accessToken);

  const title = formData.get('roomName');
  const room = await postCreateRoom({ title: title as string, headers });
  await patchJoinRoom({ id: room.id });
  redirect(`/room/${room.id}`);
}
