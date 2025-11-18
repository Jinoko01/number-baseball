'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateRoomDetailAction(roomId: number) {
  revalidateTag(`room:${roomId}`, 'max');
}
