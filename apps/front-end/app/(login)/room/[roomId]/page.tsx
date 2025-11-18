import { getMyProfile } from '@/lib/actions/getMyProfile';
import { getRoomById } from '@/lib/apis/room/getRoomById';
import { getCookie } from '@/lib/utils/next-cookie';
import { GameContextContainer, RoomUserSection } from 'ui';

interface RoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const accessToken = await getCookie('accessToken');
  const { roomId } = await params;
  const myInfo = await getMyProfile();
  const { participants } = await getRoomById({ roomId: Number(roomId) });

  return (
    <main className='bg-blue-50 min-h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] px-2 py-4 flex flex-col items-center gap-8'>
      <RoomUserSection
        roomId={Number(roomId)}
        _participants={participants}
        accessToken={accessToken as string}
        user={myInfo}
      />
      <GameContextContainer roomId={Number(roomId)} />
    </main>
  );
}
