'use client';

import { Room } from 'utils';
import { joinRoomAction } from '@/lib/actions/joinRoom';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <button onClick={() => joinRoomAction(room.id)}>
      <li className='cursor-pointer hover:shadow-lg flex flex-col justify-between rounded-md overflow-hidden shadow-md'>
        <div className='bg-blue-100 w-full'>
          <h3 className='text-md font-semibold text-center p-1'>{room.title}</h3>
        </div>
        <div className='flex justify-between rooms-center gap-2 px-2 py-1'>
          <div className=''>방 상태</div>
          <div>
            {room.currentCount} / {room.capacity}
          </div>
        </div>
      </li>
    </button>
  );
}
