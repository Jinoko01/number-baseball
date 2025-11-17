import { getRoomById } from '@/lib/apis/room/getRoomById';
import { UserCard } from 'ui';

interface RoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params;
  const { participantIds } = await getRoomById({ roomId: Number(roomId) });

  return (
    <main className='bg-blue-50 min-h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] px-2 py-2'>
      <div className='flex justify-between items-center'>
        {participantIds.map((participantId) => (
          <UserCard
            key={participantId}
            user={{
              id: 1,
              name: '플레이어 1',
              nickname: '플레이어 1',
              avatar: '',
              provider: 'GITHUB',
            }}
          />
        ))}
      </div>
      <div>게임 내용을 출력하는 공간</div>
    </main>
  );
}
