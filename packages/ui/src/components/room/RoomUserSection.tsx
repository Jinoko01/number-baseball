'use client';

import { RoomParticipants, useSocketStore } from 'utils';
import { UserCard } from './UserCard';
import { Button } from '../common/Button';
import { useEffect } from 'react';
import { setSocket } from '@/lib/utils/socket';
import { revalidateRoomDetailAction } from '@/lib/actions/revalidateRoomDetailAction';
import { useState } from 'react';
import { leaveRoomAction } from '@/lib/actions/leaveRoom';

interface RoomUserSectionProps {
  roomId: number;
  _participants: RoomParticipants[];
  accessToken: string;
  user: {
    id: number;
    nickname: string;
    avatar: string;
  };
}

export function RoomUserSection({
  roomId,
  _participants,
  accessToken,
  user,
}: RoomUserSectionProps) {
  const { socketClient, setSocketClient } = useSocketStore();
  const [participants, setParticipants] = useState(_participants);

  useEffect(() => {
    const socket = setSocket(accessToken);
    setSocketClient(socket);

    socket.on('roomJoined', (participants: RoomParticipants[]) => {
      setParticipants(participants);
      revalidateRoomDetailAction(roomId);
    });

    socket.on('roomLeave', (participants: RoomParticipants[]) => {
      setParticipants(participants);
      revalidateRoomDetailAction(roomId);
    });

    socket.emit('roomJoined', { roomId, user });

    return () => {
      socket.emit('roomLeave', { roomId });
      leaveRoomAction(roomId);
      socket.disconnect();
    };
  }, []);

  if (!participants) {
    return null;
  }

  return (
    <div className='flex justify-evenly items-center w-full'>
      <UserCard
        user={
          participants[0] && {
            id: participants[0].user.id,
            name: participants[0].user.name,
            nickname: participants[0].user.nickname,
            avatar: participants[0].user.avatar,
            provider: participants[0].user.provider,
          }
        }
      />
      <div className='flex flex-col gap-3'>
        <Button disabled={participants.length !== 2}>게임 시작</Button>
      </div>
      <UserCard
        user={
          participants[1] && {
            id: participants[1].user.id,
            name: participants[1].user.name,
            nickname: participants[1].user.nickname,
            avatar: participants[1].user.avatar,
            provider: participants[1].user.provider,
          }
        }
      />
    </div>
  );
}
