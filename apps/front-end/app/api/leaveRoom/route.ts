import { NextResponse } from 'next/server';
import { leaveRoomAction } from '@/lib/actions/leaveRoom';
import { revalidateHomeAction } from '@/lib/actions/revalidateGameRoomAction';

export async function POST(request: Request) {
  const body = await request.json();
  const { roomId } = body;

  await leaveRoomAction(roomId);
  await revalidateHomeAction();

  return NextResponse.json({ ok: true });
}
