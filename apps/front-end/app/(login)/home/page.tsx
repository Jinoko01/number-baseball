import { getRooms } from '@/lib/apis/room/getRooms';
import { Button, CreateRoomDialog } from 'ui';

interface HomeProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const rooms = await getRooms();

  return (
    <div className='bg-blue-50 min-h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] px-2 py-2'>
      <div className='flex min-h-[calc((100vh-4rem))] max-h-[calc((100vh-4rem))]'>
        <div className='w-2/3 bg-white rounded-md shadow-sm px-4 pt-1'>
          <header className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <h2 className='text-lg font-semibold'>방 목록</h2>
              <p className='text-sm text-gray-600'>총 {rooms.total}개의 방</p>
            </div>
            <div className='flex items-center gap-2'>
              <Button size='sm' variant='outline'>
                <span className='text-xs font-semibold'>새로고침</span>
              </Button>
              <CreateRoomDialog />
            </div>
          </header>
          <ul className='grid grid-cols-2 grid-rows-[repeat(5,auto)] grid-flow-col gap-2'>
            {rooms.items.map((item) => (
              <li
                className='cursor-pointer hover:shadow-lg flex flex-col justify-between rounded-md overflow-hidden shadow-md'
                key={item.id}
              >
                <div className='bg-blue-100 w-full'>
                  <h3 className='text-md font-semibold text-center p-1'>{item.title}</h3>
                </div>
                <div className='flex justify-between items-center gap-2 px-2 py-1'>
                  <div className=''>방 상태</div>
                  <div>
                    {item.currentCount} / {item.capacity}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className='w-1/3'>그냥 우측 화면</div>
      </div>
    </div>
  );
}
