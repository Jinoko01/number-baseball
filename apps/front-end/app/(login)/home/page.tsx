import { revalidateHomeAction } from '@/lib/actions/revalidateGameRoomAction';
import { getRooms } from '@/lib/apis/room/getRooms';
import { getCookie } from '@/lib/utils/next-cookie';
import { Button, CreateRoomDialog, HomeChattingLayout, Pagination, RoomCard } from 'ui';

interface HomeProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const accessToken = await getCookie('accessToken');
  const params = await searchParams;
  const rooms = await getRooms({
    page: Number(params.page ?? 1),
    limit: Number(params.limit ?? 10),
  });

  return (
    <div className='bg-blue-50 min-h-[calc(100vh-4rem-8px)] max-h-[calc(100vh-4rem-8px)] px-2 py-2'>
      <div className='flex min-h-[calc((100vh-4rem-8px))] max-h-[calc((100vh-4rem-8px))] gap-2'>
        <div className='flex flex-col w-2/3 bg-white rounded-md shadow-sm px-4 pt-2'>
          <header className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <h2 className='text-lg font-semibold'>방 목록</h2>
              <p className='text-sm text-gray-600'>총 {rooms.total}개의 방</p>
            </div>
            <div className='flex items-center gap-2'>
              <form action={revalidateHomeAction}>
                <Button size='sm' variant='outline' type='submit'>
                  <span className='text-xs font-semibold'>새로고침</span>
                </Button>
              </form>
              <CreateRoomDialog />
            </div>
          </header>
          <ul className='flex-1 grid grid-cols-2 grid-rows-5 grid-flow-col gap-2 pt-2'>
            {rooms.items.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </ul>
          <div className='flex justify-center items-center pt-6'>
            <Pagination
              page={rooms.page}
              totalPages={rooms.totalPages}
              hasNext={rooms.hasNext}
              hasPrev={rooms.hasPrev}
            />
          </div>
        </div>
        <div className='w-1/3'>
          <HomeChattingLayout accessToken={accessToken as string} />
        </div>
      </div>
    </div>
  );
}
