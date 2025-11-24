'use client';

import { Room } from 'utils';
import { joinRoomAction } from '@/lib/actions/joinRoom';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <button
      onClick={() => {
        if (room.currentCount === room.capacity) {
          return;
        }
        joinRoomAction(room.id);
      }}
    >
      <li className='cursor-pointer hover:shadow-lg flex flex-col justify-between rounded-md overflow-hidden shadow-md'>
        <div className='bg-blue-100 w-full'>
          <h3 className='text-md font-semibold text-center p-1'>{room.title}</h3>
        </div>
        <div className='flex justify-center items-center gap-2 px-2 py-1'>
          <span className='font-semibold text-blue-400'>
            {room.currentCount} / {room.capacity}
          </span>
        </div>
      </li>
    </button>
  );
}
